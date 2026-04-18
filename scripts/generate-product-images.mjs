import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const ROOT_DIR = process.cwd();
const PRODUCTS_FILE = path.join(ROOT_DIR, "src", "hooks", "useData.ts");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "generated");
const DEFAULT_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview";

function parseArgs(argv) {
  const options = {
    force: false,
    dryRun: false,
    limit: undefined,
    match: undefined,
    model: DEFAULT_MODEL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--limit") {
      options.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--match") {
      options.match = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--model") {
      options.model = argv[index + 1];
      index += 1;
    }
  }

  return options;
}

function getProperty(objectLiteral, propertyName) {
  return objectLiteral.properties.find((property) => {
    if (!ts.isPropertyAssignment(property)) {
      return false;
    }

    if (ts.isIdentifier(property.name)) {
      return property.name.text === propertyName;
    }

    if (ts.isStringLiteral(property.name)) {
      return property.name.text === propertyName;
    }

    return false;
  });
}

function getStringValue(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName);
  if (!property || !ts.isPropertyAssignment(property)) {
    return undefined;
  }

  if (
    ts.isStringLiteral(property.initializer) ||
    ts.isNoSubstitutionTemplateLiteral(property.initializer)
  ) {
    return property.initializer.text;
  }

  return undefined;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function categoryStyle(category, subCategory) {
  if (category === "sweet") {
    return `Close-up studio product photo of a handmade Brazilian confection from the "${subCategory ?? "Doces"}" collection.`;
  }

  if (category === "cake" || category === "caseirinhos" || category === "pool-cake" || category === "vulcao" || category === "recheado") {
    return "Premium bakery product photo with elegant confectionery styling.";
  }

  return "Premium confectionery product photo.";
}

function buildPrompt(product) {
  if (product.category === "caseirinhos") {
    return [
      "Realistic catalog photo of a Brazilian homemade caseirinho cake.",
      `Product title: ${product.name}.`,
      `Description: ${product.description}.`,
      "The cake must be a whole round ring cake with a center hole, like a bolo de furo, simple and homemade.",
      "Show one entire cake only, never sliced, never layered, never tall celebration cake.",
      "No loaf cake shape, no rectangular pan, no muffin, no cupcake, no paper baking cup, no naked cake.",
      "Simple presentation on a neutral plate or cake stand, centered composition, soft studio lighting, clean light background.",
      "If a topping is appropriate, keep it modest and homemade, lightly covering the top of the ring cake only.",
      "Make it look like a traditional Brazilian bakery caseirinho, rustic, simple, appetizing, and authentic.",
      "No text, no labels, no people, no hands, no busy table scene.",
    ].join(" ");
  }

  return [
    categoryStyle(product.category, product.subCategory),
    `Product title: ${product.name}.`,
    `Description: ${product.description}.`,
    "Create a realistic, appetizing, high-end catalog image.",
    "Single product as the hero, centered composition, soft studio lighting, clean ivory background, subtle natural shadow.",
    "No text, no labels, no watermark added by the prompt, no people, no hands, no cutlery, no busy table scene.",
    "Keep the food visually faithful to the title and description, with artisan Brazilian confectionery presentation.",
  ].join(" ");
}

function getExtensionFromMimeType(mimeType) {
  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

async function generateImage(ai, product, model) {
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(product),
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (part.inlineData?.data) {
      const extension = getExtensionFromMimeType(part.inlineData.mimeType);
      return {
        bytes: Buffer.from(part.inlineData.data, "base64"),
        extension,
      };
    }
  }

  throw new Error(`No image returned for "${product.name}"`);
}

function replaceRanges(sourceText, replacements) {
  return replacements
    .sort((a, b) => b.start - a.start)
    .reduce((text, replacement) => {
      return text.slice(0, replacement.start) + replacement.value + text.slice(replacement.end);
    }, sourceText);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.dryRun && !process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY. Add it to your environment before running the generator.");
  }

  const ai = options.dryRun ? null : new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const sourceText = await fs.readFile(PRODUCTS_FILE, "utf8");
  const sourceFile = ts.createSourceFile(PRODUCTS_FILE, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  let productsArray;

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    for (const declaration of node.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "INITIAL_PRODUCTS" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        productsArray = declaration.initializer;
      }
    }
  });

  if (!productsArray) {
    throw new Error("Could not find INITIAL_PRODUCTS in src/hooks/useData.ts");
  }

  const products = productsArray.elements
    .filter(ts.isObjectLiteralExpression)
    .map((productNode) => {
      const id = getStringValue(productNode, "id");
      const name = getStringValue(productNode, "name");
      const description = getStringValue(productNode, "description");
      const category = getStringValue(productNode, "category");
      const subCategory = getStringValue(productNode, "subCategory");
      const imageProperty = getProperty(productNode, "image");

      if (!id || !name || !description || !category || !imageProperty || !ts.isPropertyAssignment(imageProperty)) {
        return undefined;
      }

      return {
        id,
        name,
        description,
        category,
        subCategory,
        imageStart: imageProperty.initializer.getStart(sourceFile),
        imageEnd: imageProperty.initializer.getEnd(),
      };
    })
    .filter(Boolean);

  let filteredProducts = products;

  if (options.match) {
    const normalizedMatch = options.match.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      `${product.name} ${product.description} ${product.category} ${product.subCategory ?? ""}`
        .toLowerCase()
        .includes(normalizedMatch)
    );
  }

  if (Number.isFinite(options.limit)) {
    filteredProducts = filteredProducts.slice(0, options.limit);
  }

  if (filteredProducts.length === 0) {
    console.log("No products matched the provided filters.");
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const replacements = [];

  for (const product of filteredProducts) {
    const baseFileName = `${product.id}-${slugify(product.name)}`;
    const existingGeneratedFile = `/generated/${baseFileName}.png`;
    const existingOutputPath = path.join(OUTPUT_DIR, `${baseFileName}.png`);

    if (!options.force) {
      try {
        await fs.access(existingOutputPath);
        replacements.push({
          start: product.imageStart,
          end: product.imageEnd,
          value: `'${existingGeneratedFile}'`,
        });
        console.log(`Skipping existing image for ${product.name}`);
        continue;
      } catch {
        // Continue when the file does not exist yet.
      }
    }

    console.log(`Generating image for ${product.name}...`);

    if (options.dryRun) {
      console.log(buildPrompt(product));
      continue;
    }

    try {
      const generated = await generateImage(ai, product, options.model);
      const outputFileName = `${baseFileName}.${generated.extension}`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);
      const publicPath = `/generated/${outputFileName}`;

      await fs.writeFile(outputPath, generated.bytes);

      replacements.push({
        start: product.imageStart,
        end: product.imageEnd,
        value: `'${publicPath}'`,
      });
    } catch (error) {
      console.error(`Failed to generate image for "${product.name}":`, error instanceof Error ? error.message : error);
    }
  }

  if (!options.dryRun && replacements.length > 0) {
    const updatedSource = replaceRanges(sourceText, replacements);
    await fs.writeFile(PRODUCTS_FILE, updatedSource);
    console.log(`Updated ${replacements.length} product image paths in src/hooks/useData.ts`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

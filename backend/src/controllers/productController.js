import Product from "../models/Product.js";
import { generateDescription } from "../services/groqService.js";

export async function listProducts(req, res, next){
  try{
    const items = await Product.find({}).sort({ createdAt: -1 });
    res.json(items);
  }catch(err){
    next(err);
  }
}

export async function createProduct(req, res, next){
  try{
    const { name, price, stock, keywords } = req.body;

    const item = await Product.create({
      name,
      price,
      stock,
      keywords: Array.isArray(keywords) ? keywords : [],
      createdBy: req.user._id
    });

    res.status(201).json(item);
  }catch(err){
    next(err);
  }
}

export async function updateProduct(req, res, next){
  try{
    const { id } = req.params;
    const { price, stock } = req.body;

    const item = await Product.findById(id);
    if(!item){
      res.status(404);
      throw new Error("Product not found");
    }

    if(price !== undefined) item.price = price;
    if(stock !== undefined) item.stock = stock;

    await item.save();
    res.json(item);
  }catch(err){
    next(err);
  }
}

export async function generateProductDescription(req, res, next){
  try{
    const { id } = req.params;

    const item = await Product.findById(id);
    if(!item){
      res.status(404);
      throw new Error("Product not found");
    }

    const text = await generateDescription({ name: item.name, keywords: item.keywords });
    item.description = text;
    await item.save();

    res.json({ message: "Description generated", description: text });
  }catch(err){
    next(err);
  }
}

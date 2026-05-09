// controllers/productsController.js
const { supabase } = require('../config/db');
const { PRODUCTS: MOCK_PRODUCTS } = require('../data/mockData');

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    let query = supabase.from('products').select('*');
    const { category, q, sort, min, max } = req.query;

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (q) {
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
    }
    if (min) query = query.gte('price', Number(min));
    if (max) query = query.lte('price', Number(max));
    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    // Use mockData if Supabase fails or returns empty
    if (error || !data || data.length === 0) {
      console.log('CONVIX: Supabase empty/error — using mockData');
      let results = MOCK_PRODUCTS;
      if (category && category !== 'All') results = results.filter(p => p.category === category);
      if (q) results = results.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
      if (sort === 'price_asc') results.sort((a,b) => a.price - b.price);
      else if (sort === 'price_desc') results.sort((a,b) => b.price - a.price);
      return res.json({ success: true, count: results.length, data: results });
    }

    res.json({ success: true, count: data.length, data });
  } catch (e) { 
    // Final fallback to mockData
    return res.json({ success: true, count: MOCK_PRODUCTS.length, data: MOCK_PRODUCTS });
  }
};

// GET /api/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('products').select('category');
    if (error) throw error;
    const categories = ['All', ...new Set(data.map(item => item.category))];
    res.json({ success: true, data: categories });
  } catch (e) { next(e); }
};

// GET /api/products/:id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select('*').or(`id.eq.${id},barcode.eq.${id}`).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

// GET /api/products/:id/location
exports.getLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('products').select('name,location').eq('id', id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });
    if (!data.location) return res.status(404).json({ success: false, message: 'Location data not available' });
    res.json({ success: true, product: data.name, location: data.location });
  } catch (e) { next(e); }
};

// GET /api/products/search?q=
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, count: 0, data: [] });
    const { data, error } = await supabase.from('products').select('*').or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (e) { next(e); }
};


const { json } = require('express');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		return res.render("products/products",{
			products,
			toThousand
		})
	},
	oferProducts : (req,res) =>{
		const productsOffer = products.filter(product => product.category === 'in-sale')
		res.render('products/productsOffer',{
		productsOffer,
		toThousand
		})
	},
	// Detail - Detail from one product
	detail: (req, res) => {
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const {id} = req.params
		const product = products.find((product) => product.id === +id)
		return res.render('products/detail',{
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('products/product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
		const {name,discount,price,description,category,image} = req.body
		const newProduct = {
			id: products[products.length - 1].id + 1,
			name: name.trim(),			
			description: description.trim(),
			price: +price,		
			discount: +discount,
            image : req.file? req.file.filename : null,
			category: category
		}

		products.push(newProduct)
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null,3),'utf-8')
		return res.redirect('/products/list')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params
		const product = products.find((product) => product.id === +id)
		return res.render('products/product-edit-form',{
			...product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const {id} = req.params
		const {name,discount,price,description,category,image} = req.body	
		const product = products.find((product) => product.id === +id)
		const productModified = {
			id: +id,
			name: name.trim(),			
			description: description.trim(),
			price: +price,		
			discount: +discount,
			image: product.image,
			category: category
		}
		const productsModified = products.map(product => {
			if(product.id === +id){
				return productModified
			}
			return product
		})
		fs.writeFileSync(productsFilePath, JSON.stringify(productsModified, null,3),'utf-8')
		return res.redirect('/products/detail/' + id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		const {id} = req.params
		
		const productModified = products.filter(product => product.id !== +id)
		fs.writeFileSync(productsFilePath, JSON.stringify(productModified, null,3),'utf-8')
		return res.redirect('/products/list')
	}
};

module.exports = controller;
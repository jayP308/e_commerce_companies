const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const seedProducts = require('../../seeds/product-seeds');

seedProducts();

// get all products
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;

    let products;

    if (category_id) {
      // Search for products by category_id if provided
      products = await Product.findAll({
        where: {
          category_id: category_id,
        },
      });
    } else {
      // Retrieve all products if no category_id is provided
      products = await Product.findAll();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async(req, res) => {
  try {
    const id = req.params.id
    const products = await Product.findOne({where: { id: id }})

    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {

  const category = await Category.findOne({
    where: {
      category_name: req.body.category_name,
    },
  });

  if(!category) {
    return res.status(404).json({ error: 'Category not found' });
  };

  const createProducts = await Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: category.id,
  });

  return res.status(200).json(createProducts);

});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async(req, res) => {
  // delete one product by its `id` value
  try {
    const id = req.params.id;

    const deleteProduct = await Product.destroy({
      where: {
        id: id,
      }
    });

    if (deleteProduct === 0) {
      res.status(404).json({ error: 'Category Does Not Exist!'})
    } else {
      console.log('Product Deleted Successfully!')
      res.status(200).json(deleteProduct);
    }
  } catch (err){
    res.status(500).json(err);
    return;
  }
});

module.exports = router;

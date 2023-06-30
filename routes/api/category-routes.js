const router = require('express').Router();
const { Category, Product } = require('../../models');
const seedCategories = require('../../seeds/category-seeds');

seedCategories();

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
    const category = await Category.findAll()
    res.status(200).json({category});
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const category = await Category.findOne({where: { id: id }})

    return res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async(req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name,
    });

    res.status(500).json(category);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  // create a new category
});

router.put('/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const categoryUpdate = await Category.update({
      category_name: req.body.category_name,
    },
    {
      where: {
        id: id,
      }
    });

    if(categoryUpdate[0] === 0) {
      res.status(404).json({ error: 'Cannot Find Category, Please Try Again!'})
    } else {
      res.status(500).json(categoryUpdate);
    }   
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deleteCategory = await Category.destroy({
      where: {
        id: id,
      }
    });

    if (deleteCategory === 0) {
      res.status(404).json({ error: 'Category Does Not Exist!'})
    } else {
      res.status(200).json(deleteCategory);
    }
  } catch (err){
    res.status(500).json(err);
    return;
  }
  // delete a category by its `id` value
});

module.exports = router;

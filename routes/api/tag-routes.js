const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const seedTag = require('../../seeds/tag-seeds');

seedTag();

router.get('/', async(req, res) => {
  try{
    const tags = await Tag.findAll();
    res.status(200).json(tags)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async(req, res) => {
  try {
    const id = req.params.id
    const tags = await Tag.findOne({where: { id: id }})

    return res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;

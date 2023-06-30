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

router.post('/', async(req, res) => {
  // create a new tag
  try {
    const createTag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    res.status(500).json(createTag);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value
  try {
    const id = req.params.id;
    const tagUpdate = await Tag.update({
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: id,
      }
    });

    if(tagUpdate[0] === 0) {
      res.status(404).json({ error: 'Cannot Find Tag, Please Try Again!'})
    } else {
      res.status(200).json(tagUpdate);
    }   
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const id = req.params.id;

    const deleteTag = await Tag.destroy({
      where: {
        id: id,
      }
    });

    if (deleteTag === 0) {
      res.status(404).json({ error: 'Category Does Not Exist!'})
    } else {
      console.log('Product Deleted Successfully!')
      res.status(200).json(deleteTag);
    }
  } catch (err){
    res.status(500).json(err);
    return;
  }
});

module.exports = router;

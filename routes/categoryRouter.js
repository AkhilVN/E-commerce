const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties:
 *              id: 
 *                  type: string
 *                  description: This is an autogenerated id of the category
 *              name: 
 *                  type: string
 *                  description: Name of the category
 *          example: 
 *               id: "60de26c3e1696a4748ae97bb"
 *               name: "category 05"
 *               createdAt: "2021-07-01T20:34:11.670Z"
 *               updatedAt: "2021-07-01T20:43:16.629Z"          
 */

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: The category managing apis
 */
/**
 * @swagger
 * /category:
 *  get:
 *      summary: Return the list of all categories
 *      tags: [Category]
 *      responses: 
 *          200:
 *              description: The list of categories
 *              content: 
 *                  application/json:
 *                      schema:
 *                         type: array
 *                         items: 
 *                              $ref: '#/components/schemas/Category'
 */
router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(auth, authAdmin, categoryCtrl.createCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCategory)
    .put(auth, authAdmin, categoryCtrl.updateCategory)


module.exports = router
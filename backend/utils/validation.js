const { body, validationResult } = require('express-validator');

// Auth validation rules
const registerRules = [
  body('email')
    .notEmpty().withMessage('L’e-mail est obligatoire')
    .isEmail().withMessage('Veuillez saisir une adresse e-mail valide'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('username')
    .notEmpty().withMessage('Le nom d’utilisateur est obligatoire')
    .isLength({ min: 2 }).withMessage('Le nom d’utilisateur doit contenir au moins 2 caractères'),
];

const loginRules = [
  body('email')
    .notEmpty().withMessage('L’e-mail est obligatoire')
    .isEmail().withMessage('Veuillez saisir une adresse e-mail valide'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire'),
];

// Project validation rules
const projectRules = [
  body('name')
    .notEmpty().withMessage('Le nom du projet est obligatoire')
    .isLength({ max: 100 }).withMessage('Le nom du projet ne peut pas dépasser 100 caractères'),
  body('description')
    .optional({ values: 'falsy' })
    .isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
];

// Task validation rules (create)
const taskRules = [
  body('title')
    .notEmpty().withMessage('Le titre de la tâche est obligatoire')
    .isLength({ max: 200 }).withMessage('Le titre ne peut pas dépasser 200 caractères'),
  body('projectId')
    .notEmpty().withMessage('L’identifiant du projet est obligatoire'),
  body('priority')
    .optional({ values: 'falsy' })
    .isIn(['high', 'medium', 'low']).withMessage('La priorité doit être haute, moyenne ou basse'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(['todo', 'inprogress', 'done']).withMessage('Le statut doit être à faire, en cours ou terminé'),
  body('deadline')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('La date limite doit être une date ISO 8601 valide'),
];

// Update: projectId optional (omit to keep current project)
const taskUpdateRules = [
  body('title')
    .notEmpty().withMessage('Le titre de la tâche est obligatoire')
    .isLength({ max: 200 }).withMessage('Le titre ne peut pas dépasser 200 caractères'),
  body('projectId')
    .optional({ values: 'falsy' })
    .notEmpty().withMessage('L’identifiant du projet est obligatoire'),
  body('priority')
    .optional({ values: 'falsy' })
    .isIn(['high', 'medium', 'low']).withMessage('La priorité doit être haute, moyenne ou basse'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(['todo', 'inprogress', 'done']).withMessage('Le statut doit être à faire, en cours ou terminé'),
  body('deadline')
    .optional({ values: 'falsy' })
    .isISO8601().withMessage('La date limite doit être une date ISO 8601 valide'),
];

// Validation result middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  projectRules,
  taskRules,
  taskUpdateRules,
  validate,
};

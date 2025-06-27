import { Router } from 'express';
import { __MODULE_NAME__Controller } from '@/controllers/__MODULE_NAME_LOWERCASE__.controller';

const router = Router();

router
  .route('/')
  .post(__MODULE_NAME__Controller.create__MODULE_NAME__)
  .get(__MODULE_NAME__Controller.getAll__MODULE_NAME__s);

router
  .route('/:id')
  .get(__MODULE_NAME__Controller.get__MODULE_NAME__)
  .patch(__MODULE_NAME__Controller.update__MODULE_NAME__)
  .delete(__MODULE_NAME__Controller.delete__MODULE_NAME__);

export default router;

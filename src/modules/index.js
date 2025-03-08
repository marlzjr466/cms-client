import admins from "./admins"
import theme from "./theme"
import auth from "./auth"
import doctors from "./doctors"
import attendants from "./attendants"
import categories from "./categories"
import products from "./products"
import productItems from "./product-items"
import productVariants from "./variants"
import patients from "./patients"
import records from "./records"
import queues from "./queues"

export default () => ([
  admins(),
  auth(),
  theme(),
  doctors(),
  attendants(),
  categories(),
  products(),
  productVariants(),
  productItems(),
  patients(),
  records(),
  queues()
])
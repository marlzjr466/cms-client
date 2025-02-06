import theme from "./theme"
import auth from "./auth"
import doctors from "./doctors"
import attendants from "./attendants"
import categories from "./categories"
import products from "./products"
import productVariants from "./variants"

export default () => ([
  auth(),
  theme(),
  doctors(),
  attendants(),
  categories(),
  products(),
  productVariants()
])
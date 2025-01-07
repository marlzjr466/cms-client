import theme from "./theme"
import auth from "./auth"

export default () => ([
  auth(),
  theme()
])
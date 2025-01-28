// components
import Title from '@components/base/Title'
import ThemeSelector from '../components/ThemeSelector'

function Settings () {
  return (
    <div className="settings">
      <Title title="Settings" />

      <ThemeSelector />
    </div>
  )
}

export default Settings
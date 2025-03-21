import { useEffect, useState } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'

// components
import Title from '@components/base/Title'
import ThemeSelector from '../components/ThemeSelector'

// utils
import swal from '@utilities/swal'

// hooks
import { useAuth } from '@hooks'

function Settings () {
  const { auth } = useAuth()
  const { metaStates, metaActions } = useMeta()
  const clinic = {
    ...metaStates('clinic', ['info']),
    ...metaActions('clinic', ['fetch', 'patch'])
  }

  const [name, setName] = useState(null)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    loadClinic()
  }, [])

  useEffect(() => {
    if (clinic.info) {
      setName(clinic.info.name)
      setAddress(clinic.info.address)
    }
  }, [clinic.info])

  const loadClinic = async () => {
    try {
      await clinic.fetch()
    } catch (error) {
      swal.error({
        text: error.message
      })
    }
  }

  const handleSave  = async () => {
    try {
      await clinic.patch({ name, address })

      loadClinic()
      swal.success()
    } catch (error) {
      swal.error({
        text: error.message
      })
    }
  }

  return (
    <div className="settings">
      <Title title="Settings" />
      <ThemeSelector />

      {
        auth?.role === 'admin' && (
          <div className="flex-1">
            <p className="settings_section_label">
              Clinic Information
            </p>

            <div className="settings_row">
              <div>
                <span>
                  <label>Name</label>
                  <input
                    type="text"
                    value={name || ''}
                    onChange={e => setName(e.target.value)}
                    autoComplete="off"
                  />
                </span>

                <span>
                  <label>Address</label>
                  <input
                    className="address"
                    type="text"
                    value={address || ''}
                    onChange={e => setAddress(e.target.value)}
                    autoComplete="off"
                  />
                </span>
              </div>
              
              <button
                className="btn success"
                onClick={handleSave}
              >
                <i className="fas fa-save"></i>
                Save changes
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Settings
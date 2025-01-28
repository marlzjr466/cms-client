import React from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import _ from 'lodash'

// utils
import swal from '@utilities/swal'

// hooks
import { useAuth } from '@hooks'

const ThemeSelector = () => {
  const { auth } = useAuth()
  const { metaStates, metaActions } = useMeta()

  const theme = {
    ...metaStates('theme', ['mode']),
    ...metaActions('theme', ['patch', 'fetch'])
  }

  const handleSelect = mode => {
    swal.prompt({
      title: 'Select Theme',
      text: `Are you sure you want to set ${mode === 'system' ? 'System default' : `${_.capitalize(mode)} mode`} for your theme?`,
      async onConfirm () {
        try {
          await theme.patch({
            key: 'admin_id',
            data: {
              admin_id: auth.id,
              mode
            }
          })
          
          await theme.fetch({
            filters: [
              {
                field: 'admin_id',
                value: auth.id
              }
            ],
            is_first: true
          })
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  return (
    <div className="theme-selector">
      <p className="theme-selector__description">
      Customize your app experience by selecting a theme that suits your preference.
      </p>
      
      <div className="theme-selector__options">
        <div
          className={`theme-option ${theme.mode === 'system' ? 'default' : ''}`}
          onClick={() => handleSelect('system')}
        >
          <div className={`theme-preview system-default ${theme.mode === 'system' ? 'default' : ''}`}>
            <div className="theme-preview__split">
              <div className="theme-preview__light">
                <div className="content-blocks">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="theme-preview__dark">
                <div className="content-blocks">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                {
                  theme.mode === 'system' && (
                    <span className="theme-preview__active">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  )
                }
              </div>
            </div>
          </div>
          <span className="theme-option__label">System default</span>
        </div>

        <div
          className={`theme-option ${theme.mode === 'light' ? 'default' : ''}`}
          onClick={() => handleSelect('light')}
        >
          <div className={`theme-preview light ${theme.mode === 'light' ? 'default' : ''}`}>
            <div className="theme-preview__split">
              <div className="theme-preview__light">
                <div className="content-blocks">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                {
                  theme.mode === 'light' && (
                    <span className="theme-preview__active">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  )
                }
              </div>
            </div>
          </div>
          <span className="theme-option__label">Light</span>
        </div>

        <div
          className={`theme-option ${theme.mode === 'dark' ? 'default' : ''}`}
          onClick={() => handleSelect('dark')}
        >
          <div className={`theme-preview dark ${theme.mode === 'dark' ? 'default' : ''}`}>
            <div className="theme-preview__split">
              <div className="theme-preview__dark">
                <div className="content-blocks">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              {
                theme.mode === 'dark' && (
                  <span className="theme-preview__active">
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                )
              }
            </div>
          </div>
          <span className="theme-option__label">Dark</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
import { useState, useEffect } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'

// components
import Title from '@components/base/Title'
import Loading from '@components/base/Loading'

// hooks
import { useAuth } from '@hooks'

// utils
import swal from '@utilities/swal'

function Profile () {
  const { auth } = useAuth()
  const { metaStates, metaActions, metaMutations } = useMeta()

  const meta = {
    ...metaStates(`${auth.role}s`, ['profile']),
    ...metaActions(`${auth.role}s`, ['getProfile', 'patch'])
  }

  const authentication = {
    ...metaStates('auth', ['username']),
    ...metaMutations('auth', ['SET_USERNAME']),
    ...metaActions('auth', ['changePassword'])
  }

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [username, setUsername] = useState(authentication.username || auth.username)
  const [newPassword, setNewPassword] = useState('')
  const [retypePassword, setRetypeNewPassword] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (meta.profile) {
      setFirstname(meta.profile.first_name)
      setLastname(meta.profile.last_name)
      setPhoneNumber(meta.profile.phone_number)
    }
  }, [meta.profile])

  const loadProfile = async () => {
    await meta.getProfile(auth[`${auth.role}_id`])
  }

  const handleSaveInformation = () => {
    swal.prompt({
      text: 'Save changes?',
      async onConfirm () {
        try {
          await meta.patch({
            key: 'id',
            data: {
              id: auth[`${auth.role}_id`],
              first_name: firstname,
              last_name: lastname,
              phone_number: phoneNumber
            }
          })
          
          loadProfile()
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  const handleChangePassword = () => {
    if (newPassword !== retypePassword) {
      return swal.error({
        text: 'Entered password is not the same'
      })
    }

    swal.prompt({
      text: 'Save new credentials?',
      async onConfirm () {
        try {
          const res = await authentication.changePassword({
            id: auth.id,
            username,
            password: newPassword
          })

          if (res.error) {
            throw new Error(res.error.message)
          }
          
          authentication.SET_USERNAME(username)
          setNewPassword('')
          setRetypeNewPassword('')
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
    <div className="profile">
      <Title title="My Profile" />

      <div className="flex-1">
        <p className="profile_section_label">
          Basic Information
        </p>

        <div className="profile_row">
          <div>
            <span>
              <label>Firstname</label>
              <input
                type="text"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                autoComplete="off"
              />
            </span>

            <span>
              <label>Lastname</label>
              <input
                type="text"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                autoComplete="off"
              />
            </span>

            <span>
              <label>Phone number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="off"
              />
            </span>
          </div>
          
          <button
            className="btn success"
            onClick={handleSaveInformation}
          >
            <i className="fas fa-save"></i>
            Save changes
          </button>
        </div>

        <p className="profile_section_label">
          Credentials
        </p>

        <div className="profile_row">
          <div>
            <span>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </span>

            <span>
              <label>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </span>

            <span>
              <label>Re-type new password</label>
              <input
                type="password"
                value={retypePassword}
                onChange={e => setRetypeNewPassword(e.target.value)}
              />
            </span>
          </div>
          
          <button
            className="btn success"
            onClick={handleChangePassword}
          >
            <i className="fas fa-save"></i>
            Save credentials
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
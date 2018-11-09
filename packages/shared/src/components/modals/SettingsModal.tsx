import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { PureComponent } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'

import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import { ExtractPropsFromConnector } from '../../types'
import { ModalColumn } from '../columns/ModalColumn'
import { AppVersion } from '../common/AppVersion'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import { H2 } from '../common/H2'
import { Link } from '../common/Link'
import { Spacer } from '../common/Spacer'
import { DimensionsConsumer } from '../context/DimensionsContext'
import { ThemeConsumer } from '../context/ThemeContext'
import { ThemePreference } from '../widgets/ThemePreference'

export interface SettingsModalProps {}

const connectToStore = connect(
  (state: any) => {
    const user = selectors.currentUserSelector(state)

    return {
      username: (user && user.login) || '',
    }
  },
  { logout: actions.logout },
)

class SettingsModalComponent extends PureComponent<
  SettingsModalProps & ExtractPropsFromConnector<typeof connectToStore>
> {
  render() {
    const { username } = this.props

    return (
      <ModalColumn
        columnId="preferences-modal"
        iconName="gear"
        title="Preferences"
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: contentPadding }}
        >
          <ThemePreference />

          <ThemeConsumer>
            {({ theme }) => (
              <DimensionsConsumer>
                {({ width }) => {
                  if (!username) return null
                  if (!(width <= 420)) return null

                  return (
                    <>
                      <Spacer height={contentPadding} />

                      <H2 withMargin>Account</H2>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar size={28} username={username} />
                        <Spacer width={contentPadding / 2} />
                        <Text style={{ color: theme.foregroundColor }}>
                          Logged as{' '}
                          <Link href={`https://github.com/${username}`}>
                            <Text style={{ fontWeight: 'bold' }}>
                              {username}
                            </Text>
                          </Link>
                        </Text>
                      </View>

                      <Spacer height={contentPadding} />
                      <Button
                        key="logout-button"
                        onPress={() => this.props.logout()}
                      >
                        Logout
                      </Button>
                    </>
                  )
                }}
              </DimensionsConsumer>
            )}
          </ThemeConsumer>
        </ScrollView>

        <View style={{ padding: contentPadding }}>
          <AppVersion />
        </View>
      </ModalColumn>
    )
  }
}

export const SettingsModal = connectToStore(SettingsModalComponent)

hoistNonReactStatics(SettingsModal, SettingsModalComponent as any)
import { Components, withMutation, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';


class AccountsVerifyEmail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pending: true,
            error: null
        };
    }

    async componentDidMount() {
        const token = this.props.match.params.token;

        var result = await this.props.verifyUserEmail({ token }).catch(e => {
            this.setState({
                pending: false,
                error: e.message
            });
        })

        if (result) {
            console.log(result)
            this.setState({
                pending: false,
                error: null
            });
        }

    }

    render() {
        if (this.state.pending) {
            return <Components.Loading />;
        } else if (this.state.error) {
            return (
                <div className='password-reset-form'>
                    {this.state.error.replace('GraphQL error:', '')}
                </div>
            );
        } else {
            return (
                <div className='password-reset-form'>
                    {this.context.intl.formatMessage({ id: 'accounts.email_verified' })}
                </div>
            );
        }
    }
}

AccountsVerifyEmail.contextTypes = {
    intl: intlShape
};

AccountsVerifyEmail.propsTypes = {
    currentUser: PropTypes.object,
    match: PropTypes.object.isRequired,
};

AccountsVerifyEmail.displayName = 'AccountsEnrollAccount';

const verifyUserEmail = {
    name: 'verifyUserEmail',
    args: { token: 'String' }
};

registerComponent('AccountsVerifyEmail', AccountsVerifyEmail, withCurrentUser, [withMutation, verifyUserEmail], withRouter);
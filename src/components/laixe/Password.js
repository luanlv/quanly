/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {Link} from 'react-router';
import PropTypes from 'prop-types';

import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
// import CompleteInput  from './component/Complete'
import {slugify} from '../_function'


message.config({
  // top: 100,
  duration: 3,
});

const Option = Select.Option;
const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});


class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      data: {
        password: '',
        rePassword: ''
      },
      match: false
    }
  }

  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;

    // this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    let gThis = this
    return (
      <div className="do-page">
        <div className="laixe-doWr" style={{marginTop: '0.5rem'}}>
          <h2 style={{textAlign: 'center', fontSize: '1rem'}}>Đổi mật khẩu</h2>
          <div style={{padding: '0.2rem'}}>
            <Row>
              <b style={{fontSize: '0.5rem'}}>Mật khẩu cũ:</b>
              <Input
                type="password"
                placeholder="Mật khẩu cũ"
                onChange={(e) => {
                  let value = e.target.value
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        oldPassword: value
                      }
                    }
                  })
                }}
              />
            </Row>

            <Row>
              <b style={{fontSize: '0.5rem'}}>Mật khẩu mới:</b>
              <Input
                type="password"
                placeholder="Mật khẩu mới"
                
                onChange={(e) => {
                  let value = e.target.value
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        password: value
                      }
                    }
                  })
                }}
              />
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                onChange={(e) => {
                  let value = e.target.value
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        rePassword: value
                      }
                    }
                  })
                }}
              />
            </Row>
          
            <Row style={{marginTop: 10}}>
              <Button type="primary" style={{width: '100%', height: '2rem', fontSize: '1rem'}}
                      onClick={() => {
                        if(this.state.data.password !== this.state.data.rePassword){
                          message.error("Mật khẩu không trùng khớp")
                        } else {
                          agent.LaiXe.changePass({old: this.state.data.oldPassword, new: this.state.data.password})
                            .then(res => {
                              message.success("Đổi mật khẩu thành công")
                              this.context.router.replace('/')
                            })
                            .catch(err => {
                              message.error("Mật khẩu cũ không đúng")
                            })
                        }
                      }}
              >
                Đổi mật khẩu
              </Button>
              
            </Row>
            
          </div>
          
        </div>
      </div>
    )
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DOPage);


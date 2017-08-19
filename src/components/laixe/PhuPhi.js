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

class CompleteInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: {},
      dataSource: [],
      option : props.option || []
    }
  }

  handleSearch = (value) => {
    let newOption = this.state.option.filter(option => {
      return slugify(option.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
    })

    this.setState({
      dataSource: !value ? [] : newOption.slice(0, 5)
    });

  }

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        style={{ width: '100%' }}
        onChange={(value) => this.props.onChange(value)}
        onSearch={this.handleSearch}
      />
    );
  }

}

class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      data: {}
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
      <div className="home-page phuphi" style={{marginTop: '1rem'}}>
        <div style={{padding: '0.2em'}}>
          <h2 style={{textAlign: 'center', fontSize: '1.2rem'}}>Thêm phụ phí</h2>

          <Row>
            <b style={{fontSize: '0.4rem'}}>Lý do:</b>
            <CompleteInput
              option={[
                "Tiền dầu",
                "Tiền luật",
                "Tiền nước",
                "Tiền nhà nghỉ",
              ]}
              onChange={(value) => {
                this.setState(prev => {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      khoanchi: value
                    }
                  }
                })
              }}
            />
          </Row>

          <Row style={{marginTop: 10}}>
            <b style={{fontSize: '0.4rem'}}>Số Tiền:</b>
            <InputNumber
              defaultValue={0}
              min={0}
              formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
              parser={value => value.replace(/(,*)/g, '')}
              style={{width: '100%'}}
              onChange={(value) => {
                if(parseInt(value).isNaN){
                  value = 0;
                }
                this.setState(prev => {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      sotien: value
                    }
                  }
                })
              }}
            />
          </Row>
          <Row style={{marginTop: '0.5rem'}}>
            <Button
              style={{width: '100%', height: '1.5rem', fontSize: '0.4rem'}}
              type="primary"
                    onClick={() => {
                      console.log(gThis.state.data)
                      agent.LaiXe.themPhuPhi(gThis.state.data)
                        .then(res => {
                          this.context.router.replace('/laixe/danhsachphuphi');
                          message.success("Thêm mới thành công")
                        })
                        .catch(err => {
                          message.success("Thêm mới that bai")
                        })
                    }}
            >
              Thêm mới
            </Button>
          </Row>
        </div>
      </div>
    )
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DOPage);


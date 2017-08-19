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
import PropTypes from 'prop-types';
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {Link} from 'react-router';
import moment from 'moment';
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
        defaultValue={this.props.defaultValue}
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
      edit: true,
      init: false,
      data: {}
    }
  }

  componentWillMount() {
    let that = this;
    agent.LaiXe.PhuPhibyId(this.props.params.id)
      .then(res => {
        let PhuPhi = res[0]
        that.setState(prev => { return {
          ...prev,
          edit: (moment(PhuPhi.time).diff(moment(Date.now() - 2*60*60*1000)) > 0) && !PhuPhi.trangthai.daduyet,
          init: true,
          data: PhuPhi
        }})
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    let gThis = this
    if(!this.state.init){
      return (
        <div className="do-page">
          <div className="laixe-doWr">
          </div>
        </div>)
    } else {
      if(!this.state.edit) {
        return (
          <div className="home-page" style={{marginTop: '0.5rem'}}>
            <div style={{padding: '0.2rem', paddingBottom: '2rem'}}>
              <h2 className="textCenter" style={{fontSize: '1.2rem'}}>Phụ phí</h2>
  
              <div>
                <span style={{width: '3rem', fontSize: '0.3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}>Ngày: </span><b style={{fontSize: '0.4rem'}}>{moment(this.state.data.time).format('DD/MM/YYYY')}</b>
              </div>
              
              <div>
                <span style={{width: '3rem', fontSize: '0.3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}>Khoản chi: </span><b style={{fontSize: '0.4rem'}}>{this.state.data.khoanchi}</b>
              </div>

              <div>
                <span style={{width: '3rem', fontSize: '0.3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số tiền: </span><b style={{fontSize: '0.4rem'}}>{this.state.data.sotien.toLocaleString() } đ</b>
              </div>
  
              <div>
                <span style={{width: '3rem', fontSize: '0.3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Trạng thái: </span>
                <b style={{fontSize: '0.4rem'}}>
                  {!this.state.data.trangthai.daduyet ? ("Đang xử lý") : (this.state.data.trangthai.duyet ? ("Đồng ý") : ("Hủy"))}
                </b>
              </div>
              
            </div>
            <div className="updateButton">
              <Link to="/laixe/danhsachphuphi">
                <Button type="primary"
                        style={{width: 200, height: 60, fontSize: 30}}
                >Quay lại</Button>
              </Link>
            </div>
          </div>
        )
      }
      return (
        <div className="home-page" style={{marginTop: '0.5rem'}}>
          {this.state.init && (<div style={{padding: '0.2rem', paddingBottom: '2rem'}}>
            <h2 style={{textAlign: 'center', fontSize: '1.2rem'}}>Phụ phí</h2>
      
            <Row>
              <b style={{fontSize: '0.4rem'}}>Lý do:</b>
              <CompleteInput
                defaultValue={this.state.data.khoanchi}
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
                disabled={!this.state.edit}
                defaultValue={this.state.data.sotien}
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
            <Row style={{marginTop: '1rem'}}>
              <Button
                style={{width: '100%', height: '1.5rem', fontSize: '0.4rem'}}
                type="primary"
                onClick={() => {
                  agent.LaiXe.capnhapPhuPhi(gThis.state.data)
                    .then(res => {
                      // this.context.router.replace('/laixe/danhsachphuphi');
                      message.success("Cập nhập thành công")
                    })
                    .catch(err => {
                      message.success("Cập nhập that bai")
                    })
                }}
              >
                Cập nhập
              </Button>
            </Row>
          </div>)}
  
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin  size="large" tip="Đang tải..." />
            </div>
          )}
        </div>
      )
    }
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(DOPage);


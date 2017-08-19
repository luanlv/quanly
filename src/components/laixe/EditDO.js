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
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Switch, Modal} from 'antd'
import moment from 'moment';
import { Link } from 'react-router'
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  APP_LOAD
} from '../../constants/actionTypes';

import CompleteInput  from '../_components/CompleteInput'
import CompleteInputValue  from '../_components/CompleteInputValue'
import CompleteInputPlace  from '../_components/CompleteInputPlace'
import CustomSelect  from '../_components/CustomSelect'
// import CompleteInput  from './component/Complete'

import {slugify} from '../_function'

const Option = Select.Option;
const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  xe: state.common.currentUser.xe,
  do: state.common.currentUser.do
});

const mapDispatchToProps = dispatch => ({
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),
  reloadInfo: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
});


class DOPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      init: false,
      data: {},
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      visible: false,
      edit: false,
      bks: this.props.xe.bks,
      khongnhan: false,
      lydohuy: ''
    }
  }

  componentWillMount() {
    let that = this;
    agent.LaiXe.DObyId(this.props.do)
      .then(res => {
        let DO = res[0]
        that.setState(prev => { return {
          ...prev,
          init: true,
          data: DO
        }})
      })
      .catch(err => {
      
      })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    // this.setState({
    //   visible: false,
    // });
    let that = this;
    if(this.state.khongnhan) {
  
      agent.LaiXe.huyDO({do: this.props.do, lydohuy: this.state.lydohuy})
        .then(res => {
          const token = window.localStorage.getItem('jwt');
          if (token) {
            agent.setToken(token);
          }
          this.props.reloadInfo(agent.Auth.current());
          message.success("Hủy thành công")
          this.context.router.replace('/laixe')
        })
        .catch(err => {
          message.error("Có lỗi")
        })
      
    } else {
      agent.LaiXe.nhanDO({do: this.props.do, bks: that.state.bks})
        .then(res => {
          this.context.router.replace('/laixe/do/dangdi');
          message.success("Xác nhận thành công")
        })
        .catch(err => {
          message.error("Có lỗi")
        })
    }
    
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
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
        return (
          <div className="home-page" style={{marginTop: '0.5rem'}}>
            <div style={{padding: '0.2rem', paddingBottom: '2rem'}}>
              <h2 className="textCenter" style={{fontSize: '1rem'}}>Lệnh điều xe</h2>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}>Mã lệnh: </span><b style={{fontSize: '0.6rem', color: 'red'}}>{'DO' + (this.state.data._id + 10000)}</b>
              </div>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}>Ngày: </span><b style={{fontSize: '0.6rem'}}>{moment(this.state.data.time).format('DD/MM/YYYY')}</b>
              </div>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Khách hàng : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.khachhang}</b>
              </div>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Người yêu cầu: </span><b style={{fontSize: '0.6rem'}}>{this.state.data.nguoiyeucau}</b>
              </div>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Điểm xuất phát : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.diemxuatphat}</b>
              </div>
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Điểm trả hàng: </span><b style={{fontSize: '0.6rem'}}>{this.state.data.diemtrahang}</b>
              </div>
              
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Trọng tải: </span><b style={{fontSize: '0.6rem'}}>{this.state.data.trongtai} tấn</b>
              </div>
              
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số điểm </span><b style={{fontSize: '0.6rem'}}>{this.state.data.sodiem}</b>
              </div>
              
              <div>
                <span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Quãng đường : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.sokm} KM</b>
              </div>
              
              {/*<div>*/}
                {/*<span style={{fontSize: '0.4rem', width: '3rem', display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Số tiền thu : </span><b style={{fontSize: '0.6rem'}}>{this.state.data.tienthu.toLocaleString() } đ</b>*/}
              {/*</div>*/}
              {/*<div>*/}
                {/*<span style={{width: 280, display: 'inline-block', fontWeight: 'bold', color: '#999'}}> Trạng thái : </span>*/}
                {/*<b>*/}
                  {/*{!this.state.data.trangthai.daduyet ? ("Đang xử lý") : (this.state.data.trangthai.duyet ? ("Đồng ý") : ("Hủy"))}*/}
                {/*</b>*/}
              {/*</div>*/}
            </div>
            {this.state.data.tinhtrang === 0 && <Row style={{ position: 'fixed', bottom: 0, left: 0, right: 0}}>
              <Button type="primary"
                      style={{width: '50%', height: '1.5rem', fontSize: '0.6rem'}}
                      // onClick={() => {
                      //   if(check(gThis.state.data)){
                      //     agent.LaiXe.capnhapDO(gThis.state.data)
                      //       .then(res => {
                      //         message.success("Cập nhập thành công")
                      //       })
                      //       .catch(err => {
                      //         message.error("Cập nhập thất bại")
                      //       })
                      //   }
                      //
                      // }}
                      onClick={() => this.setState({visible: true, khongnhan: false})}
              >Chọn xe</Button>
              <Button type="danger" ghost={true}
                      style={{width: '50%', height: '1.5rem', fontSize: '0.6rem'}}
                      onClick={() => {
                        this.setState(prev => {return {
                          ...prev,
                          visible: true,
                          khongnhan: true,
                        }})
                      }}
              >Không nhận</Button>
            </Row>}
            
            {this.state.data.tinhtrang > 0 && <Row style={{ position: 'fixed', bottom: 0, left: 0, right: 0}}>
              <Link to="/laixe/do/dangdi">
                <Button type="primary"
                        style={{width: '100%', height: '1.5rem', fontSize: '0.6rem'}}
                >Tiếp tục</Button>
              </Link>
            </Row>
            }
            
            <Modal
              visible={this.state.visible}
              title={!this.state.khongnhan ? "Chọn xe chờ hàng" : "Hủy lệnh điều xe"}
              maskClosable={true}
              // onOk={this.handleOk}
              // onCancel={this.handleCancel}
              footer={[
                <Button key="back" size="large" onClick={() => this.handleCancel()}>Quay lại</Button>,
                <Button key="submit" type="primary" size="large" onClick={this.handleOk}>Xác nhận</Button>,
              ]}
              className={!this.state.khongnhan ? "chonxe" : ""}
            >
              {this.state.khongnhan ? (<div>
                <b style={{fontSize: '1.2rem'}}>Lý do</b>
                <Input type="textarea" rows={4} style={{width: '100% !important', height: '3rem !important', lineHeight: '1rem', fontSize: '0.5rem'}}
                       onChange={(value) => {
                         this.setState(prev => {
                           return {
                             ...prev,
                             data: {
                               ...prev.data,
                               lydohuy: value
                             }
                           }
                         })
                       }}
                />
              </div>) : (
                <div>
                  {!this.state.edit && <div className="bks"
                                            onClick={() => this.setState({edit: true})}
                  >{this.props.xe.bks}</div>}
                  {this.state.edit && <Input
                    type="text"
                    defaultValue={this.state.bks}
                    onChange={(e) => {
                      let value = e.target.value
                      this.setState(prev => {return {
                        ...prev,
                        bks: value
                      }})
                    }}
                  />}
                </div>
              )}
              
            </Modal>
            
          </div>
        )
    }
  }

}

DOPage.contextTypes = {
  router: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(DOPage);

function valueByField(fieldName, list){
  for(let i= 0; i < list.length; i++){
    if(list[i]._id === fieldName){
      return list[i].list
    }
  }
  return []
}

function codeByValue(value, list){
  for(let i=0; i<list.length; i++){
    if(list[i].value === value){
      return list[i].code
    }
  }
  return ''
}

function check(data){
  if(data.khachhang === undefined || data.khachhang.trim().length < 1){
    message.error("Khách hàng không được để trống")
    return false
  }
  if(data.nguoiyeucau === undefined || data.nguoiyeucau.trim().length < 1){
    message.error("Người yêu cầu không được để trống")
    return false
  }
  if(data.xe.bks === undefined || data.xe.bks.trim().length < 1){
    message.error("Chưa chọn xe")
    return false
  }
  if(data.diemxuatphat=== undefined || data.diemxuatphat.trim().length < 1){
    message.error("Điểm xuất phát không được để trống")
    return false
  }
  if(data.tinhxuatphat === undefined || data.tinhxuatphat.trim().length < 1){
    message.error("Tỉnh xuất phát không được để trống")
    return false
  }
  if(data.diemtrahang === undefined ||  data.diemtrahang.trim().length < 1){
    message.error("Điểm trả hàng không được để trống")
    return false
  }
  if(data.tinhtrahang === undefined || data.tinhtrahang.trim().length < 1){
    message.error("Tỉnh trả hàng không được để trống")
    return false
  }
  if(data.trongtai === undefined || data.trongtai < 1){
    message.error("Trọng tải không được để trống")
    return false
  }
  if(data.sodiem === undefined || data.sodiem < 1){
    message.error("Số điểm trả hàng không được để trống")
    return false
  }
  if(data.sokm === undefined || data.sokm < 1){
    message.error("Số KM đi được không được để trống")
    return false
  }
  return true
}

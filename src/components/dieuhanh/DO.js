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
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Spin, DatePicker} from 'antd'
import agent from '../../agent';
import { connect } from 'react-redux';
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form'
import intersection from 'lodash/intersection'
import moment from 'moment'
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import CompleteInput  from '../_components/CompleteInput'
import CompleteInputValue  from '../_components/CompleteInputValue'
import CompleteInputPlace  from '../_components/CompleteInputPlace'
import CustomSelect  from '../_components/CustomSelect'
import SelectLaiXe  from '../_components/SelectLaiXe'
import {slugify} from '../_function'

const Option = Select.Option;
const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
  xe: state.common.currentUser.xe
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
    
    let madoitruong = intersection(props.user.role, [102, 202]).length > 0 && props.user.ma
    
    this.state = {
      data: {
        doitruong:  madoitruong,
        quaydau: this.props.quaydau || false,
        tienphatsinh: 0,
        tienthu: 0,
        trongtai: 1,
        sokm: 50,
        sodiem: 1,
        xe: this.props.xe
      },
      init: false,
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      phatsinh: false,
      doixe: false,
      laixe: []
    }
  }

  componentWillMount = async () => {
    let that = this
    const danhsachlaixe = await agent.DieuHanh.danhsachlaixe()
      // .then(res => {
      //   that.setState(prev => {return {
      //     ...prev,
      //     laixe: res
      //   }})
      // })
    const autofill = await agent.DieuHanh.autofill()
    //   .then(res => {
    //     that.setState(prev => {return {
    //       ...prev,
    //       khachhang: valueByField('khachhang', res),
    //       // diemxuatphat: valueByField('diadiem', res),
    //       diemtrahang: valueByField('diadiem', res),
    //       nguoiyeucau: valueByField('nguoiyeucau', res),
    //     }})
    // })
    const autofillPlace = await agent.DieuHanh.autofillPlace()
      // .then(res => {
      //   that.setState(prev => {return {
      //     ...prev,
      //     init: true,
      //     diemxuatphat:  res
      //   }})
      // })
    this.setState({
      laixe: danhsachlaixe,
      khachhang: valueByField('khachhang', autofill),
      diemxuatphat: autofillPlace,
      init: true
    })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }
  
  changeKhachhang(value) {
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          khachhang: value
        }
      }
    })
  }

  changeLaiXe(value) {
    console.log(value)
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          laixe: parseInt(value)
        }
      }
    })
  }


  render() {
    if(!this.state.init) return (
      <div style={{textAlign: 'center', paddingTop: 50}}>
        <Spin  size="large" tip="Đang tải..." />
      </div>
    );
    let gThis = this
    const diadiem = [];
    this.state.diemxuatphat.map((el,key) => {
      diadiem.push(<Option key={el.code}>{el.name + ' - ' + el.code + ' | ' + el.tinh.name}</Option>);
    })
    const role = this.props.user.role
    // console.log('==')
    return (
      <div className="home-page" style={{marginTop: 0 }}>
        <div style={{padding: 5}}>
          <h2 style={{textAlign: 'center', fontSize: 24}}>Lệnh điều xe {this.state.data.quaydau && "(quay đầu)"}</h2>
          {this.state.init && <div>
            <Row>
              <b style={{fontSize: 16}}>Ngày: </b>
              <DatePicker format="DD-MM-YYYY"
                          disabledDate={(current) => {
                             return current && current.valueOf() <= moment(this.props.date, 'YYYYMMDD');
                          }}
                          onChange={(value) => {this.setState(prev => {
                            return {
                              ...prev,
                              data: {
                                ...prev.data,
                                date: moment(value).format('YYYYMMDD')
                              }
                            }
                          })}}
                          defaultValue={moment(this.props.date, 'YYYYMMDD').add(1, 'days')}
              />
            </Row>
            <Row>
              <b style={{fontSize: 16}}>Thầu phụ: </b>
              <Select defaultValue={this.props.thauphu + ''} style={{ width: '100%' }} >
                {this.props.danhsachthauphu.map((el, index) => {
                  console.log(this.props.danhsachthauphu)
                  return <Option key={el.ma + index} value={'' + el.ma}>{el.ten}</Option>
                })}
                
              </Select>
            </Row>
            <Row>
                {/*<Col>*/}
                  {/*<b style={{fontSize: 16}}>Lái xe:</b>*/}
                  {/*<SelectLaiXe*/}
                    {/*disabled={!(intersection(role, [102, 202]).length > 0)}*/}
                    {/*option={this.state.laixe}*/}
                    {/*handleChange={this.changeLaiXe.bind(this)}*/}
                  {/*/>*/}
                {/*</Col>*/}
                {/*<Col span={12}>*/}
                  {/*<b style={{fontSize: 16}}>Xe:</b>*/}
                  {/*<Input*/}
                  {/*/>*/}
                {/*</Col>*/}
              </Row>
            
            
            <Row>
                <b style={{fontSize: 16}}>Khách hàng:</b>
                <CompleteInput
                  option={this.state.khachhang}
                  onChange={this.changeKhachhang.bind(this)}
                />
            </Row>
            <Row>
                <b style={{fontSize: 16}}>Người yêu cầu:</b>
                <CompleteInput
                  option={this.state.nguoiyeucau}
                  onChange={(value) => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          nguoiyeucau: value
                        }
                      }
                    })
                  }}
                />
            </Row>
            <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm xuất phát:</b>
              <Select
                // mode="multiple"
                showSearch
                style={{ width: '100%' }}
                placeholder="Chọn địa điểm"
                filterOption={(input, option) => {
                  return slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
                }
                // defaultValue={['a10', 'c12']}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        iddiemxuatphat: value
                      }
                    }
                  })
                }}
              >
                {diadiem}
              </Select>
               
            </Row>
            <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm trả hàng: </b>
              <div style={{float: 'right'}}>
                <Button type="primary"
                  onClick={() => {
                    let that = this;
                    var promptData = prompt("Danh sách code địa điểm", '');
  
                    if (promptData != null) {
                     let codeArray = promptData.split(' ');
                     let place = []
                     let notFound = []
                     codeArray.forEach(code => {
                       if(!checkCode(code, that.state.diemxuatphat)){
                         notFound.push(code)
                       } else {
                         place.push(code)
                       }
                     })
                      
                      if(notFound.length > 0 ){
                       alert(`Địa điểm ${notFound} không tồn tại!`);
                      } else {
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              iddiemtrahang: codeArray
                            }
                          }
                        })
                      }
                    }
                  }}
                >Nhập theo danh sách</Button>
                <Button type="primary"
                        onClick={() => {
                          let that = this;
                          agent.DieuHanh.autofillPlace()
                            .then(res => {
                              that.setState(prev => {return {
                                ...prev,
                                diemxuatphat:  res
                              }})
                            })
                        }}
                >Cập nhập địa điểm</Button>
              </div>
       
              {/*<CompleteInputPlace*/}
                {/*value={this.state.data.diemtrahang}*/}
                {/*option={this.state.diemtrahang}*/}
                {/*tinhthanh={this.state.data.tinhxuatphat || ''}*/}
                {/*onChange={(value) => {*/}
                  {/*this.setState(prev => {*/}
                    {/*return {*/}
                      {/*...prev,*/}
                      {/*data: {*/}
                        {/*...prev.data,*/}
                        {/*diemtrahang: value*/}
                      {/*}*/}
                    {/*}*/}
                  {/*})*/}
                {/*}}*/}
              {/*/>*/}
              
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={this.state.data.iddiemtrahang}
                placeholder="Chọn địa điểm"
                filterOption={(input, option) => slugify(option.props.children).indexOf(slugify(input.toLowerCase())) >= 0}
                // defaultValue={['a10', 'c12']}
                onChange={(value) => {
                  console.log(value)
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        iddiemtrahang: value
                      }
                    }
                  })
                }}
              >
                {diadiem}
              </Select>
              
            </Row>
            <Row style={{marginTop: 10}}>

              <Col span={24}>
                <b style={{fontSize: 16}}>Trọng tải (tấn):</b>
                <InputNumber style={{width: '100%'}} size="large"
                             value={this.state.data.trongtai}
                             min={1} max={100}
                             onChange={(value) => {
                               if(!isNaN(parseFloat(value)) || value === '') {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       trongtai: value
                                     }
                                   }
                                 })
                               } else {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       trongtai: 1
                                     }
                                   }
                                 })
                               }
                             }}
                />
              </Col>

              {/*<Col span={12}>*/}
                {/*<b style={{fontSize: 16}}>Số điểm: </b>*/}
                {/*<InputNumber style={{width: '100%'}} size="large"*/}
                             {/*value={this.state.data.sodiem}*/}
                             {/*min={1} max={100}*/}
                             {/*onChange={(value) => {*/}
                               {/*if(!isNaN(parseInt(value)) || value === '') {*/}
                                 {/*this.setState(prev => {*/}
                                   {/*return {*/}
                                     {/*...prev,*/}
                                     {/*data: {*/}
                                       {/*...prev.data,*/}
                                       {/*sodiem: value*/}
                                     {/*}*/}
                                   {/*}*/}
                                 {/*})*/}
                               {/*} else {*/}
                                 {/*this.setState(prev => {*/}
                                   {/*return {*/}
                                     {/*...prev,*/}
                                     {/*data: {*/}
                                       {/*...prev.data,*/}
                                       {/*sodiem: 1*/}
                                     {/*}*/}
                                   {/*}*/}
                                 {/*})*/}
                               {/*}*/}
                             {/*}}*/}
                {/*/>*/}
              {/*</Col>*/}
              {/*<Col span={12}>*/}
                {/*<b style={{fontSize: 16}}> KM: </b>*/}
                {/*<InputNumber style={{width: '100%'}} size="large" min={1} max={1000}*/}
                             {/*value={this.state.data.sokm}*/}
                             {/*onChange={(value) => {*/}
                               {/*if(!isNaN(parseFloat(value))) {*/}
                                 {/*this.setState(prev => {*/}
                                   {/*return {*/}
                                     {/*...prev,*/}
                                     {/*data: {*/}
                                       {/*...prev.data,*/}
                                       {/*sokm: value*/}
                                     {/*}*/}
                                   {/*}*/}
                                 {/*})*/}
                               {/*} else {*/}
                                 {/*this.setState(prev => {*/}
                                   {/*return {*/}
                                     {/*...prev,*/}
                                     {/*data: {*/}
                                       {/*...prev.data,*/}
                                       {/*sokm: 1*/}
                                     {/*}*/}
                                   {/*}*/}
                                 {/*})*/}
                               {/*}*/}
                             {/*}}*/}
                {/*/>*/}
              {/*</Col>*/}
            </Row>
  
            <Row style={{marginTop: 10}}>
            </Row>
            
            {/*<Row style={{marginTop: 10}}>*/}
            
              {/*<b style={{fontSize: 16}}>Tiền phát sinh:</b>*/}
              {/**/}
              {/*<Switch  defaultChecked={false} onChange={(value) => {*/}
              {/*this.setState(prev => { return {*/}
                {/*...prev,*/}
                {/*phatsinh: value*/}
              {/*}})}*/}
            {/*} />*/}
              {/*<div style={{display: this.state.phatsinh ? 'block': 'none'}}>*/}
                {/*<InputNumber*/}
                  {/*defaultValue={0}*/}
                  {/*min={0}*/}
                  {/*formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}*/}
                  {/*parser={value => value.replace(/(,*)/g, '')}*/}
                  {/*style={{width: '100%'}}*/}
                  {/*onChange={(value) => {*/}
                    {/*if(parseInt(value).isNaN){*/}
                      {/*value = 0;*/}
                    {/*}*/}
                    {/*this.setState(prev => {*/}
                      {/*return {*/}
                        {/*...prev,*/}
                        {/*data: {*/}
                          {/*...prev.data,*/}
                          {/*tienphatsinh: value*/}
                        {/*}*/}
                      {/*}*/}
                    {/*})*/}
                  {/*}}*/}
                {/*/>*/}
                {/*<Col style={{marginTop: 10}}>*/}
                  {/*Lý do:*/}
                  {/*<Input type="textarea" rows={2}*/}
                         {/*defaultValue={''}*/}
                         {/*style={{width: '100%', minHeight: 120}}*/}
                         {/*onChange={(e) => {*/}
                           {/*let value = e.target.value*/}
                           {/*this.setState(prev => {*/}
                             {/*return {*/}
                               {/*...prev,*/}
                               {/*data: {*/}
                                 {/*...prev.data,*/}
                                 {/*lydo: value*/}
                               {/*}*/}
                             {/*}*/}
                           {/*})*/}
                         {/*}}*/}
                  {/*/>*/}
                {/*</Col>*/}
              {/*</div>*/}
            {/*</Row>*/}
            <Row style={{}}>
              <Button type="primary"
                      style={{fontSize: 16}}
                      onClick={() => {
                        if(check(gThis.state.data)) {
                          let diemxuatphat = gThis.state.diemxuatphat[indexByCode(gThis.state.data.iddiemxuatphat, gThis.state.diemxuatphat)]
                          let diemtrahang = []
                          gThis.state.data.iddiemtrahang.map(code => {
                            diemtrahang.push(gThis.state.diemxuatphat[indexByCode(code, gThis.state.diemxuatphat)])
                          })
                          let data = gThis.state.data
                          data.diemtrahang = diemtrahang
                          data.diemxuatphat = diemxuatphat
                          
                          // console.log(gThis.state.data)
                          agent.DieuHanh.themDO(data)
                            .then(res => {
                              message.success("Thêm mới thành công")
                              // this.context.router.replace('/dieuhanh');
                              this.props.success()
                            })
                            .catch(err => {
                              message.error("Thêm mới that bai")
                            })
                        }
                      }}
              >
                Tạo mới
              </Button>
            </Row>
          </div> }
        </div>
      </div>
    )
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

function checkCode(code, list){
  for(let i=0; i<list.length; i++){
    if(list[i].code == code){
      return true
    }
  }
  return false
}

function indexByCode(code, list){
  for(let i=0; i<list.length; i++){
    if(list[i].code == code){
      return i
    }
  }
  return -1
}

function check(data){
  // if(data.laixe === undefined){
  //   message.error("Chưa chọn lai xe")
  //   return false
  // }
  if(data.khachhang === undefined || data.khachhang.trim().length < 1){
    message.error("Khách hàng không được để trống")
    return false
  }
  if(data.nguoiyeucau === undefined || data.nguoiyeucau.trim().length < 1){
    message.error("Người yêu cầu không được để trống")
    return false
  }
  if(data.iddiemxuatphat=== undefined || data.iddiemxuatphat.length < 1){
    message.error("Điểm xuất phát không được để trống")
    return false
  }
  
  // if(data.tinhxuatphat === undefined || data.tinhxuatphat.trim().length < 1){
  //   message.error("Tỉnh xuất phát không được để trống")
  //   return false
  // }
  
  if(data.iddiemtrahang === undefined ||  data.iddiemtrahang.length < 1){
    message.error("Điểm trả hàng không được để trống")
    return false
  }
  
  // if(data.tinhtrahang === undefined || data.tinhtrahang.trim().length < 1){
  //   message.error("Tỉnh trả hàng không được để trống")
  //   return false
  // }
  
  if(data.trongtai === undefined || data.trongtai < 1){
    message.error("Trọng tải không được để trống")
    return false
  }
  
  // if(data.sodiem === undefined || data.sodiem < 1){
  //   message.error("Số điểm trả hàng không được để trống")
  //   return false
  // }
  if(data.sokm === undefined || data.sokm < 1){
    message.error("Số KM đi được không được để trống")
    return false
  }
  return true
}
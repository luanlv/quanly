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
import ReactSelect from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

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


const searchStyle = {
  width: '100%'
}



var getOptions = function(input, callback) {
  setTimeout(function() {
    callback(null, {
      options: [
        { code: 'one', label: 'One' },
        { code: 'two', label: 'Two' }
      ],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};

const khachhang = [
  {code: 'KH01', value: 'VIN'},
  {code: 'KH02', value: 'LENSON'},
  {code: 'KH03', value: 'KHÁCH LẺ'},
]
const nguoiyeucau = [
  {code: 'YC01', value: 'Phùng Hoài Nam'},
  {code: 'YC02', value: 'Ngô Văn Hưng'},
  {code: 'YC03', value: 'Ngô Văn Hưng'},
  {code: 'YC04', value: 'Nguyễn Văn Mạnh'},
  {code: 'YC05', value: 'Trần Văn Mỹ'},
  {code: 'YC06', value: 'Trần Ngọc Chỉnh'},
  {code: 'YC07', value: 'Trần Ngọc Duyệt'},
  {code: 'YC08', value: 'Đinh Thị Hưởng'},
]

class DOPage extends React.Component {

  constructor(props){
    super(props)
    
    let madoitruong = intersection(props.user.role, [101]).length > 0 ? null : props.user.ma
    
    // console.log(props.user.ma)
    let obj = {}
    props.danhsachxe.forEach(el => {
      obj[el.laixe] = el
    })
  
    const data = Object.assign({}, props.data)
    if(props.tinhtrang === 0 && props.data.thauphu !== 101){
      data.laixe = 999;
      // props.danhsachlaixe.push({})
      // console.log(props.danhsachlaixe)
    }
    
    this.state = {
      data: props.tinhtrang >= 0 ? data : {
        doitruong:  madoitruong,
        quaydau: this.props.quaydau || false,
        tienphatsinh: 0,
        tienthu: 0,
        trongtai: 1,
        sokm: 50,
        sodiem: 1,
        xe: '',
        laixe: -1
      },
      init: false,
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      phatsinh: false,
      doixe: false,
      laixe: props.danhsachlaixe || [],
      xe: props.danhsachxe || [],
      danhsachxe: props.danhsachxe.map(el => {return el.bks}),
      xeOBJ: obj,
      select: []
    }
  }

  componentWillMount = async () => {
    let that = this
 
    const autofill = await agent.DieuHanh.autofill()

    const autofillPlace = await agent.DieuHanh.autofillPlace()
    this.setState({
      khachhang: khachhang,
      nguoiyeucau: nguoiyeucau,
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
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          laixe: parseInt(value)
        }
      }
    })
    
    if(this.state.xeOBJ[parseInt(value)]){
      this.setState(prev => {
        return {
          ...prev,
          data: {
            ...prev.data,
            xe: this.state.xeOBJ[parseInt(value)].bks
          }
        }
      })
    }
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
      diadiem.push(<Option key={el.code}>{el.name + ' - ' + el.code}</Option>);
      // diadiem.push(<Option key={el.code}>{el.name + ' - ' + el.code + ' | ' + el.tinh.name}</Option>);
    })
    const role = this.props.user.role
    return (
      <div className="home-page" style={{marginTop: 0 }}>
        <div style={{padding: 5}}>
          <h2 style={{textAlign: 'center', fontSize: 24}}>Lệnh điều xe {this.state.data.quaydau && "(quay đầu)"}</h2>
          {this.state.init && <div>
            {this.props.tinhtrang >= 0 && <Row>
              <b style={{fontSize: 16}}>Ngày: </b>
              <DatePicker format="DD-MM-YYYY"
                          disabledDate={(current) => {
                             return current && current.valueOf() < moment(Date.now()).add(-1, 'days');
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
                          defaultValue={moment(Date.now())}
              />
            </Row>}
            {this.props.tinhtrang < 0 && intersection(role, [101]).length > 0 && <Row>
              <b style={{fontSize: 16}}>Đội trưởng:</b>
              <Select style={{ width: '100%' }}
                      onChange={(val) => {
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              doitruong: parseInt(val)
                            }
                          }
                        })
                      }}
              >
                <Option value={'' + 1012}>Trần Văn Mỹ</Option>
                <Option value={'' + 1013}>Trần Ngọc Chỉnh</Option>
              </Select>
            </Row>
              }
              
            {this.props.tinhtrang < 0 && this.props.thauphu && <Row>
              <b style={{fontSize: 16}}>Thầu phụ: </b>
              <Select style={{ width: '100%' }}
                      onChange={(val) => {
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              thauphu: parseInt(val)
                            }
                          }
                        })
                      }}
              >
                {this.props.danhsachthauphu.filter((el) => {return el.ma !== 101}).map((el, index) => {
                  return <Option key={el.ma + index} value={'' + el.ma}>{el.ten}</Option>
                })}
                
              </Select>
            </Row>}
            
            { this.props.tinhtrang < 0 && (this.state.data.thauphu === 999) && <Row>
              <b style={{fontSize: 16}}>Giá chuyến: </b>
              <InputNumber
                defaultValue={this.state.data.giachuyen}
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
                        giachuyen: value
                      }
                    }
                  })
                }}
              />
            </Row>
            }
            
            {this.props.tinhtrang >=0 && this.state.data.thauphu === 101 &&<Row>
                <Col>
                  <b style={{fontSize: 16}}>Lái xe:</b>
                  <SelectLaiXe
                    disabled={!(intersection(role, [1002]).length > 0)}
                    option={this.state.laixe}
                    handleChange={this.changeLaiXe.bind(this)}
                  />
                </Col>
                <Col span={24}>
                  <b style={{fontSize: 16}}>Xe:</b>
                  <AutoComplete
                    style={{width: '100%'}}
                    dataSource={this.state.danhsachxe}
                    value={this.state.data.xe}
                    onChange={(v) => {
                      this.setState(prev => {
                        return {
                          ...prev,
                          data: {
                            ...prev.data,
                            xe: v
                          }
                        }
                      })
                    }}
                    placeholder="xxX-xxxxx"
                    // filterOption={(inputValue, option) => {return true}}
                  />
                </Col>
            </Row>}
  
  
            {this.props.tinhtrang === 0 && this.state.data.thauphu !== 101 &&<Row>
              <Col>
                <b style={{fontSize: 16}}>BKS:</b>
                <Input
                  onChange={(e) => {
                    let value = e.target.value;
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          xe: value
                        }
                      }
                    })
                  }}
                />
              </Col>
         
            </Row>}
  
  
            {this.props.tinhtrang < 0 && <Row>
                <b style={{fontSize: 16}}>Khách hàng:</b>
                <CompleteInput
                  option={this.state.khachhang}
                  onChange={this.changeKhachhang.bind(this)}
                />
            </Row>}
            {this.props.tinhtrang < 0 && <Row>
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
            </Row>}
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm xuất phát:</b>
              <Select
                // mode="multiple"
                showSearch
                style={searchStyle}
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
              
            </Row>}
  
  
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>
              <b style={{fontSize: 16}}>Điểm trả hàng: </b>
              {/*<div style={{float: 'right'}}>*/}
                {/*<Button type="primary"*/}
                  {/*onClick={() => {*/}
                    {/*let that = this;*/}
                    {/*var promptData = prompt("Danh sách code địa điểm", '');*/}
              
                    {/*if (promptData != null) {*/}
                     {/*let codeArray = promptData.split(' ');*/}
                     {/*let place = []*/}
                     {/*let notFound = []*/}
                     {/*codeArray.forEach(code => {*/}
                       {/*if(!checkCode(code, that.state.diemxuatphat)){*/}
                         {/*notFound.push(code)*/}
                       {/*} else {*/}
                         {/*place.push(code)*/}
                       {/*}*/}
                     {/*})*/}
                      {/**/}
                      {/*if(notFound.length > 0 ){*/}
                       {/*alert(`Địa điểm ${notFound} không tồn tại!`);*/}
                      {/*} else {*/}
                        {/*this.setState(prev => {*/}
                          {/*return {*/}
                            {/*...prev,*/}
                            {/*data: {*/}
                              {/*...prev.data,*/}
                              {/*iddiemtrahang: codeArray*/}
                            {/*}*/}
                          {/*}*/}
                        {/*})*/}
                      {/*}*/}
                    {/*}*/}
                  {/*}}*/}
                {/*>Nhập theo danh sách</Button>*/}
                {/*<Button type="primary"*/}
                        {/*onClick={() => {*/}
                          {/*let that = this;*/}
                          {/*agent.DieuHanh.autofillPlace()*/}
                            {/*.then(res => {*/}
                              {/*that.setState(prev => {return {*/}
                                {/*...prev,*/}
                                {/*diemxuatphat:  res*/}
                              {/*}})*/}
                            {/*})*/}
                        {/*}}*/}
                {/*>Cập nhập địa điểm</Button>*/}
              {/*</div>*/}
       
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
                style={searchStyle}
                value={this.state.data.iddiemtrahang}
                placeholder="Chọn địa điểm"
                filterOption={(input, option) => slugify(option.props.children).indexOf(slugify(input.toLowerCase())) >= 0}
                // defaultValue={['a10', 'c12']}
                onChange={(value) => {
                  // console.log(value)
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
              
              {/*<ReactSelect.Async*/}
                {/*multi={true}*/}
                {/*valueKey="code"*/}
                {/*// valueRenderer={option => {return option.name}}*/}
                {/*name="form-field-name"*/}
                {/*value={this.state.select}*/}
                {/*loadOptions={getOptions}*/}
                {/*onChange={(e) => {*/}
                  {/*let value = this.state.select*/}
                  {/*value.push(e[0].code)*/}
                  {/*console.log(value)*/}
                  {/*this.setState({select: value})*/}
                {/*}}*/}
              {/*/>*/}
              
            </Row>}
  
  
  
            {this.props.tinhtrang < 0 && <Row style={{marginTop: 10}}>

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
            </Row>}
            
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
            
            <Row style={{marginTop: 20}}>
              {this.props.tinhtrang < 0 && <Button type="primary"
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
              </Button>}
  
              {this.props.tinhtrang === 0 && <Button type="primary"
                                                   style={{fontSize: 16}}
                                                   onClick={() => {
                                                     if(checkLaiXe(gThis.state.data)) {
                                                       agent.DieuHanh.chonlaixe(gThis.state.data)
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
                Chọn lái xe & xe
              </Button>}
              
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

function checkLaiXe(data){

  if(!data.laixe){
    message.error("Lái xe không được để trống")
    return false
  }
  
  if(!data.xe){
    message.error("Xe không được để trống")
    return false
  }
  
  return true
}
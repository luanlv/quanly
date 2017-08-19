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
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber, Spin, Switch} from 'antd'
import agent from '../../agent';
import { connect } from 'react-redux';
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form'

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import CompleteInput  from '../_components/CompleteInput'
import CompleteInputValue  from '../_components/CompleteInputValue'
import CompleteInputPlace  from '../_components/CompleteInputPlace'
import CustomSelect  from '../_components/CustomSelect'
import {slugify} from '../_function'

const Option = Select.Option;
const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
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
    this.state = {
      data: {
        tienphatsinh: 0,
        tienthu: 0,
        trongtai: 1,
        sokm: 0,
        sodiem: 1,
        xe: this.props.xe
      },
      init: false,
      khachhang: [],
      diemxuatphat: [],
      diemtrahang: [],
      nguoiyeucau: [],
      phatsinh: false,
      doixe: false
    }
  }

  componentWillMount() {
    let that = this
    agent.LaiXe.autofill()
      .then(res => {
        that.setState(prev => {return {
          ...prev,
          init: true,
          khachhang: valueByField('khachhang', res),
          diemxuatphat: valueByField('diadiem', res),
          diemtrahang: valueByField('diadiem', res),
          nguoiyeucau: valueByField('nguoiyeucau', res),
        }})
      })
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    let gThis = this
    return (
      <div className="do-page">
        <div className="laixe-doWr">
          <h2 style={{textAlign: 'center'}}>Lệnh điều động xe</h2>
          {this.state.init && <div>
            <Row>
              <Col span={12}>
                Khách hàng: <br/>
                <CompleteInput
                  option={this.state.khachhang}
                  onChange={(value) => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          khachhang: value
                        }
                      }
                    })
                  }}
                />
              </Col>
              <Col span={12}>
                Người yêu cầu: <br/>
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
              </Col>
            </Row>
            <Row style={{marginTop: 10}}>
              Điểm xuất phát: <br/>
                <CompleteInputPlace
                  isSmall={true}
                  value={this.state.data.diemxuatphat}
                  option={this.state.diemxuatphat}
                  onChange={(value) => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          diemxuatphat: value
                        }
                      }
                    })
                  }}
                  selectOption={(value) => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          tinhxuatphat: codeByValue(value, this.state.diemxuatphat)
                        }
                      }
                    })
                  }}
                />
                <CustomSelect
                  value={this.state.data.tinhxuatphat}
                  handleChange={value => {
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          tinhxuatphat: value
                        }
                      }
                    })
                  }}
                  selectOption={(value) => {
                    let tmp = codeByValue(this.state.data.diemxuatphat, this.state.diemxuatphat)
                    if(tmp !== undefined && tmp !== value){
                      this.setState(prev => {
                        return {
                          ...prev,
                          data: {
                            ...prev.data,
                            diemxuatphat: ''
                          }
                        }
                      })
                    }
                  }}
                />
            </Row>
            <Row style={{marginTop: 10}}>
              Điểm trả hàng: <br/>
              <CompleteInputPlace
                isSmall={true}
                value={this.state.data.diemtrahang}
                option={this.state.diemtrahang}
                onChange={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        diemtrahang: value
                      }
                    }
                  })
                }}
                selectOption={(value) => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        tinhtrahang: codeByValue(value, this.state.diemtrahang)
                      }
                    }
                  })
                  
                  }
                }
              />
              <CustomSelect
                value={this.state.data.tinhtrahang}
                handleChange={value => {
                  this.setState(prev => {
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        tinhtrahang: value
                      }
                    }
                  })
                }}
                selectOption={(value) => {
                  let tmp = codeByValue(this.state.data.diemtrahang, this.state.diemtrahang)
                  if(tmp !== undefined && tmp !== value){
                    this.setState(prev => {
                      return {
                        ...prev,
                        data: {
                          ...prev.data,
                          diemtrahang: ''
                        }
                      }
                    })
                  }
                }}
              />
            </Row>
            <Row style={{marginTop: 10}}>

              <Col span={12}>
                Trọng tải (tấn): <br/>
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

              <Col span={12}>
                Số điểm trả hàng:
                <InputNumber style={{width: '100%'}} size="large"
                             value={this.state.data.sodiem}
                             min={1} max={100}
                             onChange={(value) => {
                               if(!isNaN(parseInt(value)) || value === '') {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       sodiem: value
                                     }
                                   }
                                 })
                               } else {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       sodiem: 1
                                     }
                                   }
                                 })
                               }
                             }}
                />
              </Col>
            </Row>
            <Row style={{marginTop: 10}}>
              <Col span={12}>
                Quãng đường(km)
                <InputNumber style={{width: '100%'}} size="large" min={1} max={1000}
                             value={this.state.data.sokm}
                             onChange={(value) => {
                               if(!isNaN(parseFloat(value))) {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       sokm: value
                                     }
                                   }
                                 })
                               } else {
                                 this.setState(prev => {
                                   return {
                                     ...prev,
                                     data: {
                                       ...prev.data,
                                       sokm: 1
                                     }
                                   }
                                 })
                               }
                             }}
                />
              </Col>
              <Col span={12}>
                Tiền thu hộ:
                <InputNumber
                  defaultValue={this.state.data.tienthu}
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
                          tienthu: value
                        }
                      }
                    })
                  }}
                />
              </Col>
            </Row>
  
            <Row style={{marginTop: 10}}>
               .{this.props.xe.bks && !this.state.doixe && (<span>Xe chở hàng: <b style={{color: 'red', fontWeight: 'bold'}}>{this.props.xe.bks}</b> - <i>{this.props.xe.trongtai} tấn</i></span>) }
              
              <span  style={{float: 'right'}}> Đi xe khác: <Switch defaultChecked={false} onChange={(value) => {
              this.setState(prev => { return {
                ...prev,
                doixe: value
              }})}
            } />
              </span>
              <div style={{display: this.state.doixe ? 'block': 'none'}}>
                <Row>
                  <Col span={12}>
                    Biển kiếm soát:
                    <Input
                      defaultValue={this.state.data.xe.bks}
                      onChange={(e) => {
                        let value = e.target.value
                        this.setState(prev => {
                          return {
                            ...prev,
                            data: {
                              ...prev.data,
                              xe: {
                                ...prev.data.xe,
                                bks: value
                              }
                            }
                          }
                        })
                      }}
                    />
                  </Col>
                  
                  <Col span={12}>
                    Trọng tải:
                    <InputNumber style={{width: '100%'}} size="large"
                                 defaultValue={this.state.data.xe.trongtai}
                                 min={1} max={100}
                                 onChange={(value) => {
                                   if(!isNaN(parseFloat(value)) || value === '') {
                                     this.setState(prev => {
                                       return {
                                         ...prev,
                                         data: {
                                           ...prev.data,
                                           xe: {
                                             ...prev.data.xe,
                                             trongtai: value
                                           }
                                         }
                                       }
                                     })
                                   } else {
                                     this.setState(prev => {
                                       return {
                                         ...prev,
                                         data: {
                                           ...prev.data,
                                           xe: {
                                             ...prev.data.xe,
                                             trongtai: 1
                                           }
                                         }
                                       }
                                     })
                                   }
                                 }}
                    />
                  </Col>
                </Row>
              </div>
            </Row>
            
            <Row style={{marginTop: 10}}>
              Tiền phát sinh: <Switch  defaultChecked={false} onChange={(value) => {
              this.setState(prev => { return {
                ...prev,
                phatsinh: value
              }})}
            } />
              <div style={{display: this.state.phatsinh ? 'block': 'none'}}>
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
                          tienphatsinh: value
                        }
                      }
                    })
                  }}
                />
                <Col style={{marginTop: 10}}>
                  Lý do:
                  <Input type="textarea" rows={2}
                         defaultValue={''}
                         style={{width: '100%', minHeight: 120}}
                         onChange={(e) => {
                           let value = e.target.value
                           this.setState(prev => {
                             return {
                               ...prev,
                               data: {
                                 ...prev.data,
                                 lydo: value
                               }
                             }
                           })
                         }}
                  />
                </Col>
              </div>
            </Row>
            <Row style={{marginTop: 20, paddingBottom: 50}}>
              <Button type="primary"
                      style={{height: 56, width: 200, fontSize: 24}}
                      onClick={() => {
                        if(check(gThis.state.data)) {
                          agent.LaiXe.themDO(gThis.state.data)
                            .then(res => {
                              this.context.router.replace('/laixe/danhsachdo');
                              message.success("Thêm mới thành công")
                            })
                            .catch(err => {
                              message.success("Thêm mới that bai")
                            })
                        }
                      }}
              >
                Tạo mới
              </Button>
            </Row>
          </div> }
          
          {!this.state.init && (
            <div style={{textAlign: 'center', paddingTop: 50}}>
              <Spin  size="large" tip="Đang tải..." />
            </div>
          )}
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
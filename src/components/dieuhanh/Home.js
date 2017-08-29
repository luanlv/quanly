import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import intersection from 'lodash/intersection'
import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs, Popconfirm} from 'antd';
import DO from './DO'
import moment from 'moment'
var async = require('async')
const TabPane = Tabs.TabPane;

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      init: false,
      visible: false,
      quaydau: false,
      data: {
        mien: 'bac'
      },
      phongban: [],
      DOs: [],
      loadingText: '...',
      action: 'them',
      thauphu: false,
      danhsachthauphu: [],
      thauphuOBJ: {},
      danhsachlaixe: [],
      laixeOBJ: {},
      danhsachxe: [],
      xeOBJ: {},
      tinhtrang: -1,
    }
    this.init()
  }
  
  componentWillMount = () => {
  
  }
  
  init = async () => {
    let that = this;
    try {
      const date = await agent.DieuHanh.getDate();
      const DOs = await agent.DieuHanh.getDOs();
      const danhsachthauphu = await agent.DieuHanh.danhSachThauPhu();
      const danhsachlaixe = await agent.DieuHanh.danhsachlaixe()
      const danhsachxe = await agent.DieuHanh.danhsachxe()
      // console.log(date)
      if (date && DOs) {
        let tp = {}
        danhsachthauphu.forEach(el => {
          tp[el.ma] = el
        })
        let lx = {}
        danhsachlaixe.forEach(el => {
          lx[el.ma] = el
        })
        lx[999] = {ten : 'Lái xe thầu phụ'}
        this.setState({
          date: date.date,
          DOs: DOs,
          danhsachthauphu: danhsachthauphu,
          danhsachlaixe: danhsachlaixe,
          danhsachxe: danhsachxe,
          thauphuOBJ: tp,
          laixeOBJ: lx,
          init: true,
        })
      }
    }catch (e) {
      that.setState({
        loadingText: '' + e
      })
    }
    
  }

  render() {
    const role = this.props.user.role;
    
    let lenhcho = []
    let chuanhan = []
    let danhan = []
    let hoanthanh = []
    let daduyet = []
    
    this.state.DOs.map((el, index) => {
      if(el.laixe === -1 || el.tinhtrang === 0){
        lenhcho.push(el)
      } else if(el.tinhtrang === 1){
        chuanhan.push(el)
      } else if(el.tinhtrang === 2){
        danhan.push(el)
      } else if(el.tinhtrang === 3 || el.tinhtrang === 5){
        hoanthanh.push(el)
      } else if(el.tinhtrang === 4){
        daduyet.push(el)
      }
    })
    
    if(!this.state.init){
      return (
        <div>
          {this.state.loadingText}
        </div>
      )
    }
    
    return (
      <div className="home-page" style={{marginTop: 10, padding: 10}}>
        <h2 style={{textAlign: 'center', color: 'red'}}>{moment(this.state.date, 'YYYYMMDD').format('DD-MM-YYYY')}</h2>
        <span style={{marginRight: 5}}>
          <Button type="primary" onClick={this.showModal1}>COLOMBUS</Button>
        </span>
        <span style={{marginRight: 5}}>
          <Button type="danger" onClick={this.showModal2}>COLOMBUS (quay đầu)</Button>
        </span>
        <span style={{marginRight: 5}}>
          <Button type="primary" onClick={this.thauphu}>Thầu phụ</Button>
        </span>
        <span style={{marginRight: 5}}>
          <Button type="danger" onClick={this.thauphuquaydau}>Thầu phụ (quay đầu)</Button>
        </span>
        <hr
          style={{margin: 10}}
        />
        {/*// modal*/}
        <Tabs
          defaultActiveKey="1"
          tabPosition={"top"}
        >
          <TabPane tab={"Lệnh chờ " + "(" + lenhcho.length + ")"} key="1">
            {lenhcho.map((el, index) => {
              return (
                <div key={index}
                  className="shadow"
                  style={{borderRadius: 3, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 16, padding: 5, cursor: 'pointer'}}
                  onClick={() => this.chonLaiXe(el)}
                >
                  {el.thauphu === 101 ? (<b style={{color: "blue" }}>Lái Xe COLOMBUS</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}>{this.state.thauphuOBJ[el.thauphu].ten}</b></span>)}
                  <br/>
                  Mã DO: <b style={{color: 'red'}}>{el._id}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b style={{color: 'red'}}>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <span key={index2} style={{paddingLeft: 20}}><b>[{index2 + 1}] {diemtra.name}</b></span>
                  })}
                  <br/>
                  Trọng tải: <b>{el.trongtai}</b> Tấn
                  <br/>
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Chưa nhận " + "(" + chuanhan.length + ")"} key="2">
            {chuanhan.map((el, index) => {
              return (
                <div key={index}
                     style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 16, padding: 5, cursor: 'pointer'}}
                >
                  {el.thauphu === 101 ? (<b style={{color: "blue" }}>Lái Xe COLOMBUS</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}>{this.state.thauphuOBJ[el.thauphu].ten}</b></span>)}
                  <br/>
                  Lái xe & xe: <b style={{color: el.thauphu === 101 ? "blue":"green" }}>{(this.state.laixeOBJ[el.laixe] && this.state.laixeOBJ[el.laixe].ten)}</b> - <b style={{color: 'red'}}>{el.xe}</b>
                  <br/>
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Lái xe: <b>{el.laixe}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <span key={index2} style={{paddingLeft: 20}}><b>[{index2 + 1}] {diemtra.name}</b></span>
                  })}
                  <br/>
                  Trọng tải: <b>{el.trongtai}</b> Tấn
                  <br/>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.nhanLenhThay(el)
                      .then(res => {
                      message.success("Thành công")
                      // this.context.router.replace('/dieuhanh');
                        this.init()
                    })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="primary">Nhận lệnh</Button>
                  </Popconfirm>
                    <span style={{margin: '0 5px'}}>|</span>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.huyLenhThay(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init()
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="danger">Hủy lệnh</Button>
                  </Popconfirm>
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Đã nhận " + "(" + danhan.length + ")"} key="3">
            {danhan.map((el, index) => {
              return (
                <div key={index}
                     style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 16, padding: 5, cursor: 'pointer'}}
                >
                  {el.thauphu === 101 ? (<b style={{color: "blue" }}>Lái Xe COLOMBUS</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}>{this.state.thauphuOBJ[el.thauphu].ten}</b></span>)}
                  <br/>
                  Lái xe & xe: <b style={{color: el.thauphu === 101 ? "blue":"green" }}>{(this.state.laixeOBJ[el.laixe] && this.state.laixeOBJ[el.laixe].ten)}</b> - <b style={{color: 'red'}}>{el.xe}</b>
                  <br/>
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Lái xe: <b>{el.laixe}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <span key={index2} style={{paddingLeft: 20}}><b>[{index2 + 1}] {diemtra.name}</b></span>
                  })}
                  <br/>
                  Trọng tải: <b>{el.trongtai}</b> Tấn
                  <br/>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.daGiaoHang(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init()
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="primary">Đã giao hàng</Button>
                  </Popconfirm>
                  <span style={{margin: '0 5px'}}>|</span>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.huyChuyen(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init()
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="danger">Hủy chuyến</Button>
                  </Popconfirm>
                  <span style={{margin: '0 5px'}}>|</span>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.huyChuyen2(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init()
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="ghost">Hủy chuyến 2</Button>
                  </Popconfirm>
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Hoàn thành " + "(" + hoanthanh.length + ")"} key="4">
            {hoanthanh.map((el, index) => {
              return (
                <div key={index}
                     style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 16, padding: 5, cursor: 'pointer', background: el.tinhtrang === 5 ? 'rgba(100, 100, 100, 0.3)': '' }}
                >
                  {el.thauphu === 101 ? (<b style={{color: "blue" }}>Lái Xe COLOMBUS</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}>{this.state.thauphuOBJ[el.thauphu].ten}</b></span>)}
                  <br/>
                  Lái xe & xe: <b style={{color: el.thauphu === 101 ? "blue":"green" }}>{(this.state.laixeOBJ[el.laixe] && this.state.laixeOBJ[el.laixe].ten)}</b> - <b style={{color: 'red'}}>{el.xe}</b>
                  <br/>
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Lái xe: <b>{el.laixe}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <span key={index2} style={{paddingLeft: 20}}><b>[{index2 + 1}] {diemtra.name}</b></span>
                  })}
                  <br/>
                  Trọng tải: <b>{el.trongtai}</b> Tấn
                  <br/>
                  <Popconfirm title="Xác nhận?" onConfirm={() => {
                    agent.DieuHanh.duyet(el)
                      .then(res => {
                        message.success("Thành công")
                        // this.context.router.replace('/dieuhanh');
                        this.init()
                      })
                      .catch(err => {
                        message.error("That bai")
                      })
                  }} onCancel={() => {}} okText="Đồng ý" cancelText="Hủy">
                    <Button type="primary">Duyệt</Button>
                  </Popconfirm>
                  
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Đã duyệt " + "(" + daduyet.length + ")"} key="5">
            {daduyet.map((el, index) => {
              return (
                <div key={index}
                     style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "orange": "#ddd", fontSize: 16, padding: 5, cursor: 'pointer'}}
                >
                  {el.thauphu === 101 ? (<b style={{color: "blue" }}>Lái Xe COLOMBUS</b>) : (<span>Thầu phụ: <b style={{color: 'green'}}>{this.state.thauphuOBJ[el.thauphu].ten}</b></span>)}
                  <br/>
                  Lái xe & xe: <b style={{color: el.thauphu === 101 ? "blue":"green" }}>{(this.state.laixeOBJ[el.laixe] && this.state.laixeOBJ[el.laixe].ten)}</b> - <b style={{color: 'red'}}>{el.xe}</b>
                  <br/>
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Lái xe: <b>{el.laixe}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <span key={index2} style={{paddingLeft: 20}}><b>[{index2 + 1}] {diemtra.name}</b></span>
                  })}
                  <br/>
                  Trọng tải: <b>{el.trongtai}</b> Tấn
                  <br/>
                </div>
              )
            })}
          </TabPane>
          
        </Tabs>
  
        <Modal
          className={this.state.quaydau && "chuyenquaydau"}
          title={"Lệnh điều xe " + (this.state.quaydau ? "quay đầu" : "mới")}
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="Đóng"
          cancelText="."
        >
          {this.state.visible && this.state.tinhtrang === -1 &&
          <DO quaydau={this.state.quaydau}
              danhsachxe={this.state.danhsachxe}
              danhsachlaixe={this.state.danhsachlaixe}
              success={() => {
                this.hideModal()
                this.init()
              }}
              thauphu={this.state.thauphu}
              danhsachthauphu={this.state.danhsachthauphu}
              // date={this.state.date}
              tinhtrang={this.state.tinhtrang}
          />}
  
          {this.state.visible && this.state.tinhtrang === 0 &&
          <DO danhsachxe={this.state.danhsachxe}
              danhsachlaixe={this.state.danhsachlaixe}
              danhsachthauphu={this.state.danhsachthauphu}
              success={() => {
                this.hideModal()
                this.init()
              }}
              data={this.state.data}
              tinhtrang={this.state.tinhtrang}
          />}
          
        </Modal>
      </div>
    )
  }
  
  showModal1 = () => {
    this.setState({
      visible: true,
      quaydau: false,
      thauphu: false,
      tinhtrang: -1,
      action: 'them'
    });
  }
  
  showModal2 = () => {
    this.setState({
      visible: true,
      quaydau: true,
      thauphu: false,
      tinhtrang: -1,
      action: 'them'
    });
  }
  
  thauphu = () => {
    this.setState({
      visible: true,
      quaydau: false,
      thauphu: true,
      tinhtrang: -1,
      action: 'them'
    });
  }
  
  thauphuquaydau = () => {
    this.setState({
      visible: true,
      quaydau: true,
      thauphu: true,
      tinhtrang: -1,
      action: 'them'
    });
  }
  
  chonLaiXe = (data) => {
    this.setState({
      visible: true,
      // quaydau: true,
      // thauphu: true,
      data: data,
      tinhtrang: 0,
    });
  }
  
  hideModal = () => {
    this.setState({
      visible: false,
      data: null
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

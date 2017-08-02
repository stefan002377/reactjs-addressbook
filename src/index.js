import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './css/style.css';
import $ from "jquery";

class AddressBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listContacts: [],
      listTypePhones: [],
      listTypeAddress: [],
      liststatessua: [],
      statusEdit: false,
      curentContact: 1,
      dropDownSelect:0,
      popup: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchQuestions();
  }

  fetchQuestions() {
    $.ajax({
      method: 'GET',
      url: '/data/addressbook.json',
      success: (addressbook) => {
        addressbook[0].listContacts.map(c => {
          c.ergivenname = '';
          c.ersurname = '';
          c.eremail = '';
          c.phoneNumbers.map(p => {
            p.displayDrop = false;
            p.erphonnumber = '';
            return p;
          });
          c.addresses.map(a => {
            a.displayDrop = false;
            a.erstreet = '';
            a.erstate = '';
            a.ercity = '';
            a.erpostalCode = '';
            return a;
          });
          return c;
        });
        this.setState({
          listContacts: addressbook[0].listContacts,
          listTypePhones: addressbook[0].listTypePhones,
          listTypeAddress: addressbook[0].listTypeAddress,
          liststatessua: addressbook[0].liststatessua
        });
      }
    });
  }

  selectContact(id) {
    if(!this.state.statusEdit){
      let statusEditPage = false;
      this.state.listContacts.filter(f=>id===f.contactID).map(a => {
           if(a.givenName.length === 0 || a.surname.length === 0 || a.email.length === 0 ) {
             statusEditPage = true;
           }
           return a;
      })
      this.setState({
        curentContact: id,
        statusEdit: statusEditPage
      });
    }
  }

  newContact() {
    if(!this.state.statusEdit){
      let tempaddressBook = this.state.listContacts.sort((a, b) => { return b.contactID-a.contactID})
      let newID;
      if(tempaddressBook.length>0) {
      newID = tempaddressBook[0].contactID + 1;
      } else {
      newID = 1;
      }
      let newAddContact = {
        contactID: newID,
        givenName: "",
        surname: "",
        email: "",
        phoneNumbers: [],
        addresses: [],
      };
      this.setState({
        listContacts: [...this.state.listContacts,newAddContact],
        statusEdit: true,
        curentContact: newID
      });
    }
  }

  editContact() {
    this.setState({statusEdit: true});
  }

  deleteContact() {
    let tempaddressBook = this.state.listContacts.filter( a => a.contactID!==this.state.curentContact).sort((a, b) => { return a.contactID-b.contactID});
    let chengeID;
    if(tempaddressBook.length>0) {
    chengeID = tempaddressBook[0].contactID;
    } else {
    chengeID = 0;
    }
    this.setState({
      listContacts: tempaddressBook,
      statusEdit: false,
      popup: false,
      curentContact: chengeID
    });
  }

  doneContact() {
    if(this.validateForm()){
      this.setState({statusEdit: false});
    }
  }

  actionType(actiontype, type, idContact, identry, value) {
    let tempaddressBook = this.state.listContacts.map(c => {
      if (c.contactID === idContact) {
        if (type === 1) {
          c.phoneNumbers.map(p => {
            if (identry === p.phoneID) {
              if(actiontype===2){
                p.phoneType = value;
                this.resetDrop();
                return p;
              }
              if(actiontype===1){
                p.displayDrop = true;
                return p;
              }
            }
            return p;
          });
        }

        if (type === 2) {
          c.addresses.map(a => {
            if (identry === a.addressID) {
              if(actiontype===2){
                a.addressType = value;
                this.resetDrop();
                return a;
              }
              if(actiontype===1){
                a.displayDrop = true;
                return a;
              }
            }
            return a;
          });
        }
      }
      return c;
    });
    this.setState({listContacts: tempaddressBook});
  }

  resetDrop() {
    let tempaddressBook = this.state.listContacts.map(c => {
      c.phoneNumbers.map(p => {
        p.displayDrop = false;
        return p;
      });
      c.addresses.map(a => {
        a.displayDrop = false;
        return a;
      });
      return c;
    });
    this.setState({listContacts: tempaddressBook});
  }

  addNewtypeData(type, idContact) {
    let tempaddressBook = this.state.listContacts.map(c => {
      if(c.contactID===idContact){
      if(type===1){
        let templistPhone = c.phoneNumbers.sort((a, b) => { return b.phoneID-a.phoneID});
        let newID;
        if(templistPhone.length>0) {
        newID = templistPhone[0].phoneID + 1;
        } else {
        newID = 1;
        }
        let newPhone = {
          phoneID: newID,
          phoneType: "Home Phone",
          phoneNumber: "",
          displayDrop: false
        };
        c.phoneNumbers = [...templistPhone,newPhone];
      }
      if(type===2){
        let templistAddress = c.addresses.sort((a, b) => { return b.addressID-a.addressID});
        let newID;
        if(templistAddress.length>0) {
        newID = templistAddress[0].addressID + 1;
        } else {
        newID = 1;
        }
        let newAddress = {
          addressID: newID,
          addressType: "Home Address",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          displayDrop: false
        };
        c.addresses = [...templistAddress,newAddress];
      }
     }
     return c;
   });
    this.setState({listContacts: tempaddressBook});
  }

  deletetypeData(type, idContact, identry) {
    let tempaddressBook = this.state.listContacts.map(c => {
      if(c.contactID===idContact){
      if(type===1){
        let templistPhone = c.phoneNumbers.filter(a=>a.phoneID!==identry);
        c.phoneNumbers = templistPhone;
      }
      if(type===2){
        let templistAddress = c.addresses.filter(a=>a.addressID!==identry);
        c.addresses = templistAddress;
      }
     }
     return c;
    })
    this.setState({listContacts: tempaddressBook});
  }

  confirmPopupDelete(){
    this.setState({popup: true});
  }

  noPopup(){
    this.setState({popup: false});
  }

  handleChange(event) {

    let tempaddressBook = this.state.listContacts.map(c => {
      if(c.contactID===this.state.curentContact){
        if(event.target.name === 'givenname') {
            if(/^[a-zA-Z ]*$/.test(event.target.value)){
              c.givenName = event.target.value;
              if(c.givenName.length>1) {
                c.givenName = c.givenName.charAt(0).toUpperCase() + c.givenName.slice(1)
              }
              c.ergivenname = "";
            }
        }

        if(event.target.name === 'surname') {
          if(/^[a-zA-Z ]*$/.test(event.target.value)){
            c.surname = event.target.value;
            if(c.surname.length>1) {
              c.surname = c.surname.charAt(0).toUpperCase() + c.surname.slice(1)
            }
            c.ersurname = "";
          }
        }

        if(event.target.name === 'email') {
            c.email = event.target.value;
            c.eremail = "";
        }

        c.phoneNumbers.map(p => {
          if(event.target.name === 'phone'+p.phoneID) {
            if(event.target.value.length<=12 && /^[0-9-]{0,12}$/.test(event.target.value)){
                p.phoneNumber = event.target.value;
                if(event.target.value.replace('-',"").length===10){
                  p.phoneNumber = p.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
                p.erphonenumber = "";
            }
          }
          return p;
        });

        c.addresses.map(a => {
          if(event.target.name === 'address'+a.addressID) {
            a.street = event.target.value;
            a.erstreet = "";
          }
          if(event.target.name === 'city'+a.addressID) {
            if(/^[a-zA-Z ]*$/.test(event.target.value)){
               a.city = event.target.value;
               if(a.city.length>1) {
                 a.city = a.city.charAt(0).toUpperCase() + a.city.slice(1)
               }
               a.ercity = "";
            }
          }
          if(event.target.name === 'state'+a.addressID) {
            if(/^[a-zA-Z ]*$/.test(event.target.value)){
              a.state = event.target.value;
              a.erstate = "";
            }
          }
          if(event.target.name === 'postalcode'+a.addressID) {
            if(/^[0-9]{0,5}$/.test(event.target.value)){
              a.postalCode = event.target.value;
              a.erpostalcode = "";
            }
          }
          return a;
        });
      }
     return c;
    })
    this.setState({
      listContacts: tempaddressBook
    });
   }

  validateForm (){
    let errorStatus = true;
    let tempaddressBook = this.state.listContacts.map(c => {
      if(c.contactID===this.state.curentContact){
        if(c.givenName.length===0){
          c.ergivenname = "First Name is Required";
          errorStatus = false;
        }
        else if(!/^[a-zA-Z ]*$/.test(c.givenName)){
          c.ergivenname = "First Name is Incorrect";
          errorStatus = false
        }
        else {
          c.ergivenname = "";
        }
        if(c.surname.length===0){
          c.ersurname = "Last Name is Required";
          errorStatus = false;
        }
        else if(!/^[a-zA-Z ]*$/.test(c.surname)){
          c.ersurname = "Last Name is Incorrect";
          errorStatus = false
        }
        else {
          c.ersurname = "";
        }
        if(c.email.length===0){
          c.eremail = "Email is Required";
          errorStatus = false;
        }
        else if(!/^[a-zA-Z0-9 ]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(c.email)){
          c.eremail = "Email is Incorrect";
          errorStatus = false
        }
        else {
          c.eremail = "";
        }
        c.phoneNumbers.map(p => {
          if(p.phoneNumber.length===0){
            p.erphonenumber = "Phone is Required";
            errorStatus = false;
          }
          else if(!/^[0-9-]{12}$/.test(p.phoneNumber)){
            p.erphonenumber = "Phone is Incorrect";
            errorStatus = false
          }
          else {
            p.erphonenumber = "";
          }
          return p;
        });
        c.addresses.map(a => {
            if(a.street.length===0){
              a.erstreet = "Street is Required";
              errorStatus = false;
            }
            else if(!/^\d+\s[A-z]+\s[A-z]+/.test(a.street)){
              a.erstreet = "Street is Incorrect";
              errorStatus = false
            }
            else {
              a.erstreet = "";
            }
            if(a.city.length===0){
              a.ercity = "City is Required";
              errorStatus = false;
            }
            else if(!/^[a-zA-Z ]*$/.test(a.city)){
              a.ercity = "City is Incorrect";
              errorStatus = false
            }
            else {
              a.ercity = "";
            }
            if(a.state.length===0){
              a.erstate = "State is Required";
              errorStatus = false;
            }
            else if(!/^[a-zA-Z ]*$/.test(a.state)){
              a.erstate = "State is Incorrect";
              errorStatus = false
            }
            else {
              a.erstate = "";
            }
            if(a.postalCode.length===0){
              a.erpostalcode = "Postal Code Required";
              errorStatus = false;
            }
            else if(!/^[0-9]{5}$/.test(a.postalCode)){
              a.erpostalcode = "Postal Code is Incorrect";
              errorStatus = false
            }
            else {
              a.erpostalcode = "";
            }
          return a;
        });
      }
     return c;
    })
    this.setState({
      listContacts: tempaddressBook
    });
    return errorStatus;
  }

  render() {

    return (
      <div className="container addressbook">
        <div className={"row header "+ (this.state.statusEdit ? "visible-no-activ": "")}>
          <div className="col-md-12 col-lg-12 col-sm-12 page-header clearfix">
            <h2 className="pull-left">Address Book</h2>
            <h5 className="nquest pull-right">You have {this.state.listContacts.length} contacts</h5>
          </div>
        </div>
        <div className="row">
          <div className={"col-md-3 col-lg-3 col-sm-3 sidebar "+ (this.state.statusEdit ? "visible-no-activ": "")}>
            <div className="list-group">
              {this.state.listContacts.sort((a,b)=>a.contactID-b.contactID).map(a=>
                <div className={"list-group-item " + (a.contactID===this.state.curentContact ? 'active' : '')} key={a.contactID} onClick={()=> this.selectContact(a.contactID)}>{a.givenName.length>0 ? a.givenName+' '+a.surname : '[No Name]' }</div>
              )}
               <div onClick={()=> this.newContact()} className="list-group-item"><span className="glyphicon glyphicon-plus"></span>Add New Contact</div>
            </div>
          </div>
          {this.state.listContacts.length>0 &&
          <div className="col-md-9 col-lg-9 col-sm-9 content">
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 header-button">
              {this.state.statusEdit &&
              <button className="btn-sm btn-danger pull-left" onClick={()=> this.confirmPopupDelete()}>Delete</button>
              }
              {!this.state.statusEdit && <button className="btn-sm btn-warning pull-right" onClick={()=> this.editContact()}>Edit</button>}
              {this.state.statusEdit && <button className="btn-sm btn-info pull-right disabled" onClick={()=> this.doneContact()}>Update</button>}
            </div>
             {!this.state.statusEdit ? (
             <div className="form-horizontal  info-curentuser">
             {this.state.listContacts.filter(c => c.contactID === this.state.curentContact).map(a=>
             <div key={a.contactID}>
                {a.givenName.length > 0 &&
                <div className="form-group">
                  <label className="col-sm-3 control-label">First Name</label>
                  <div className="col-sm-9">
                    <div className="valueline">{a.givenName}</div>
                  </div>
                </div>
                }
                {a.surname.length > 0 &&
                <div className="form-group">
                  <label className="col-sm-3 control-label">Last Name</label>
                  <div className="col-sm-9">
                    <div className="valueline">{a.surname}</div>
                  </div>
                </div>
                }
                {a.email.length > 0 &&
                <div className="form-group">
                  <label className="col-sm-3 control-label">Email</label>
                  <div className="col-sm-9">
                    <div className="valueline">{a.email}</div>
                  </div>
                </div>
                }
                {a.phoneNumbers.map(p=>
                  p.phoneNumber.length>0 &&
                  <div className="form-group" key={p.phoneID}>
                    <label className="col-sm-3 control-label">{p.phoneType}</label>
                    <div className="col-sm-9">
                      <div className="valueline">{p.phoneNumber}</div>
                    </div>
                  </div>
                )}
                {a.addresses.map(ad=>
                  (ad.street.length>0 && ad.state.length>0 && ad.city.length>0 && ad.postalCode.length>0) &&
                  <div className="form-group" key={ad.addressID}>
                    <label className="col-sm-3 control-label">{ad.addressType}</label>
                    <div className="col-sm-9">
                      <div className="valueline">{ad.street}</div>
                      <div className="valueline">{ad.city}, {ad.state}, {ad.postalCode}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>
            ) : (
            <form className="form-horizontal form-curentuser">
              {this.state.listContacts.filter(c => c.contactID === this.state.curentContact).map((a,i)=>
              <div key={i}>
                <div className="form-group">
                  <label className="col-sm-3 control-label">First Name</label>
                  <div className="col-sm-9">
                    <input type="text" onChange={this.handleChange}  value={a.givenName} name="givenname" className="form-control" placeholder="First Name"/>
                    <span className="help-block clearfix">{a.ergivenname}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label">Last Name</label>
                  <div className="col-sm-9">
                    <input type="text" onChange={this.handleChange}   value={a.surname} name="surname" className="form-control" placeholder="Last Name"/>
                    <span className="help-block clearfix">{a.ersurname}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label">Email</label>
                  <div className="col-sm-9">
                    <input type="text" onChange={this.handleChange}   value={a.email} name="email" className="form-control" placeholder="Last Name"/>
                    <span className="help-block clearfix">{a.eremail}</span>
                  </div>
                </div>
                {a.phoneNumbers.sort((a,b)=>a.phoneID-b.phoneID).map(p=>
                  <div className="form-group" key={p.phoneID}>
                    <label  onMouseLeave={()=> this.resetDrop()} className="col-sm-3 control-label dropaction">
                      <span onClick={()=> this.deletetypeData(1,this.state.curentContact,p.phoneID)} className="glyphicon glyphicon-remove"></span>{p.phoneType}<span onClick={()=> this.actionType(1,1,this.state.curentContact,p.phoneID)} className="glyphicon glyphicon-triangle-bottom"></span>
                      {p.displayDrop &&
                      <div className="list-group">
                        {this.state.listTypePhones.map((ph,i)=>
                            <div key={i} onClick={()=> this.actionType(2,1,this.state.curentContact,p.phoneID,ph)}>{ph}</div>
                        )}
                      </div>
                      }
                    </label>
                    <div className="col-sm-9">
                      <input type="text" onChange={this.handleChange}  value={p.phoneNumber} name={'phone'+p.phoneID} className="form-control" placeholder="Phone"/>
                      <span className="help-block">{p.erphonenumber}</span>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label onClick={()=> this.addNewtypeData(1,this.state.curentContact)} className="col-sm-3 control-label addnewinfo"><span className="glyphicon glyphicon-plus"></span>Add New Phone</label>
                  <div className="col-sm-9"></div>
                </div>
                {a.addresses.sort((a,b)=>a.addressID-b.addressID).map(ad=>
                  <div className="form-group" key={ad.addressID}>
                    <label onMouseLeave={()=> this.resetDrop()} className="col-sm-3 control-label dropaction">
                      <span onClick={()=> this.deletetypeData(2,this.state.curentContact,ad.addressID)} className="glyphicon glyphicon-remove"></span>{ad.addressType}<span onClick={()=> this.actionType(1,2,this.state.curentContact,ad.addressID)} className="glyphicon glyphicon-triangle-bottom"></span>
                      {ad.displayDrop &&
                      <div className="list-group">
                        {this.state.listTypeAddress.map((p,i)=>
                            <div key={i} onClick={()=> this.actionType(2,2,this.state.curentContact,ad.addressID,p)}>{p}</div>
                        )}
                      </div>
                      }
                    </label>
                    <div className="col-sm-9">
                      <input type="text" onChange={this.handleChange}  value={ad.street} name={'address'+ad.addressID} className="form-control"  placeholder="Street"/>
                      <span className="help-block clearfix">{ad.erstreet}</span>
                      <div className="shortInput">
                        <input type="text" onChange={this.handleChange}  value={ad.city} name={'city'+ad.addressID} className="form-control"  placeholder="City"/>
                        <span className="help-block clearfix">{ad.ercity}</span>
                      </div>
                      <div className="shortInput">
                        <select value={ad.state} onChange={this.handleChange} name={'state'+ad.addressID}>
                          {this.state.liststatessua.map((a,i)=>
                              <option value={a.abbreviation}>{a.name}</option>
                          )}
                        </select>
                        <span className="help-block clearfix">{ad.erstate}</span>
                     </div>
                     <div className="shortInput lastinput">
                      <input type="text" onChange={this.handleChange}  value={ad.postalCode} name={'postalcode'+ad.addressID} className="form-control" placeholder="PostalCode"/>
                      <span className="help-block clearfix">{ad.erpostalcode}</span>
                     </div>
                   </div>
                  </div>
                )}
                <div className="form-group">
                  <label onClick={()=> this.addNewtypeData(2,this.state.curentContact)} className="col-sm-3 control-label addnewinfo"><span className="glyphicon glyphicon-plus"></span>Add New Address</label>
                  <div className="col-sm-9"></div>
                </div>
              </div>
              )}
            </form>
            )}
          </div>
        }
        </div>
        {this.state.popup &&
        <div className="popup">
          <div className="boxpopup">
             <p>Are you sure you want to delete it?</p>
             <div className="row">
               <div className="col-md-6 col-lg-6 col-sm-6 text-right">
                 <button className="btn-sm btn-danger" onClick={()=>this.deleteContact()}>Delete</button>
               </div>
               <div className="col-md-6 col-lg-6 col-sm-6 text-left">
                 <button className="btn-sm btn-info" onClick={()=>this.noPopup()}>Keep</button>
               </div>
             </div>
          </div>
          <div className="background-popup"></div>
        </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<AddressBook/>, document.getElementById('root'));

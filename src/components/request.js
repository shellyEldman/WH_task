import React, { useState } from "react";
import countryNames from "../names.json";
import validator from "email-validator";
import isValidDomain from "is-valid-domain";
import firebase from "../config/fbConfig";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const db = firebase.firestore();

const Requset = () => {
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [sourceType, setSourceType] = useState("News");
  const [country, setCountry] = useState("United States");
  const [reason, setReason] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [domainValid, setDomainValid] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [requestExists, setRequestExists] = useState(false);
  const [show, setShow] = useState(false);
  const [successShow, setSuccessShow] = useState(false);
  const [sameDomain, setSameDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const successHandleClose = () => setSuccessShow(false);
  const successHandleShow = () => setSuccessShow(true);

  const sourceTypeList = ["News", "Blogs", "Discussions", "Reviews"];

  const validateEmail = () => {
    setEmailValid(validator.validate(email));
    return validator.validate(email);
  };

  const checkIfRequestExists = () => {
    db.collection("emails")
      .doc(email)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const domains = [...doc.data().domains];
          const index = domains.indexOf(domain);
          if (index >= 0) {
            setRequestExists(true);
            handleShow();
            setSameDomain(domain);
            setLoading(false);
          } else {
            writeRequestToDB(domains);
          }
        } else {
          writeRequestToDB([]);
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  };

  const validateDomain = () => {
    setDomainValid(isValidDomain(domain));
    return isValidDomain(domain);
  };

  const onSubmit = () => {
    setSubmit(true);
    setRequestExists(false);
    if (!email || !domain) return;
    if (!validateEmail() || !validateDomain()) return;
    setLoading(true);
    checkIfRequestExists();
  };

  const writeRequestToDB = existsDomains => {
    db.collection("requests")
      .add({
        email,
        domain,
        sourceType,
        country,
        reason
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        return db
          .collection("emails")
          .doc(email)
          .set({
            domains: [...existsDomains, domain]
          });
      })
      .then(function() {
        successHandleShow();
        setFinal();
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        setFinal();
        console.error("Error adding document: ", error);
      });
  };

  const setFinal = () => {
    setLoading(false);
    setSameDomain("");
    setEmail("");
    setSameDomain("");
    setDomain("");
    setCountry("United States");
    setSourceType("News");
    setReason("");
    setEmailValid(true);
    setDomainValid(true);
    setSubmit(false);
    setRequestExists(false);
  };

  const printSourceType = () => {
    const list = sourceTypeList.map((type, i) => {
      return (
        <option value={type} key={i}>
          {type}
        </option>
      );
    });

    return list;
  };

  const printCountries = () => {
    const values = Object.values(countryNames);
    const list = values.map((country, i) => {
      return (
        <option value={country} key={i}>
          {country}
        </option>
      );
    });

    return list;
  };

  return (
    <div className="App d-flex flex-column justify-content-center align-items-center">
      <div className="my-form my-3 bg-light border rounded px-3 py-2">
        <h2>Request Form</h2>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            className={
              !emailValid || (!email && submit)
                ? "form-control border-danger"
                : "form-control"
            }
            id="email"
          />
          {!emailValid && (
            <small className="text-danger">
              * Email must be in valid format!
            </small>
          )}
          {!email && submit && (
            <small className="text-danger">* Email is required!</small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="domain">Domain Name</label>
          <input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            type="text"
            className={
              !domainValid ||
              (!domain && submit) ||
              (requestExists && domain === sameDomain)
                ? "form-control border-danger"
                : "form-control"
            }
            id="domain"
          />
          {!domainValid && (
            <small className="text-danger">
              * Domain must be in valid format - example.com
            </small>
          )}
          {!domain && submit && (
            <small className="text-danger">* Domain name is required!</small>
          )}
          {requestExists && domain === sameDomain && (
            <small className="text-danger">* Try a different domain!</small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="type">Source Type</label>
          <select
            value={sourceType}
            onChange={e => setSourceType(e.target.value)}
            className="custom-select"
            id="type"
          >
            {printSourceType()}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="country">Source Country</label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="custom-select"
            id="country"
          >
            {printCountries()}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Reason</label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={reason}
            onChange={e => setReason(e.target.value)}
          ></textarea>
        </div>
        <button
          onClick={onSubmit}
          className="btn btn-info btn-block"
          disabled={loading ? true : false}
        >
          {!loading && <span>Submit</span>}
          {loading && (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </button>
      </div>

      <Modal show={show} onHide={handleClose} className="App">
        <Modal.Header closeButton>
          <Modal.Title>Request Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-danger">
            The following request is already maid!
          </h5>
          <p>
            <span className="font-weight-bold">user:</span> {email}
          </p>
          <p>
            <span className="font-weight-bold">domain:</span> {domain}
          </p>
          <p className="font-weight-bold">Try a different domain!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={successShow} onHide={successHandleClose} className="App">
        <Modal.Header closeButton>
          <Modal.Title>New Requset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-success">Your Request Submited successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/">
            <Button variant="info">Home</Button>
          </Link>
          <Button variant="secondary" onClick={successHandleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Requset;

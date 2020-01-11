import React, { useEffect, useState } from "react";
import firebase from "../config/fbConfig";

const db = firebase.firestore();

const Status = () => {
  const [requsets, setRequests] = useState([]);

  useEffect(() => {
    db.collection("requests").onSnapshot(function(querySnapshot) {
      let myRequests = [];
      querySnapshot.forEach(function(doc) {
        myRequests.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setRequests(myRequests);
    });
  }, []);

  const deleteRequset = (id, email, domain) => {
    console.log(id, email, domain);
    db.collection("requests")
      .doc(id)
      .delete()
      .then(function() {
        console.log("Document successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });

    db.collection("emails")
      .doc(email)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          const domains = [...doc.data().domains];
          let filteredDOmains = domains.filter(myDomain => myDomain !== domain);
          return db
            .collection("emails")
            .doc(email)
            .set({
              domains: filteredDOmains
            });
        } else {
          console.log("No such document!");
        }
      })
      .then(() => {
        console.log("Domain successfully deleted!");
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  };

  return (
    <div className="App">
      <div className="status container">
        <h2 className="mt-3">Requests Status</h2>
        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Domain</th>
              <th scope="col">Source</th>
              <th scope="col">Country</th>
              <th scope="col">Reason</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {requsets &&
              requsets.map((request, i) => {
                return (
                  <tr key={request.id}>
                    <th scope="row">{i + 1}</th>
                    <td>{request.email}</td>
                    <td>{request.domain}</td>
                    <td>{request.sourceType}</td>
                    <td>{request.country}</td>
                    <td>{request.reason}</td>
                    <td>
                      <i
                        className="fas fa-trash text-danger"
                        onClick={() =>
                          deleteRequset(
                            request.id,
                            request.email,
                            request.domain
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Status;

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./components/App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
// if you're in create-react-app import the files as:
// import store from "./js/store/index";
// import App from "./js/components/App.jsx";
render(
  <Provider store={store}>
    <App />
  </Provider>,
  // The target element might be either root or app,
  // depending on your development environment
  // document.getElementById("app")
  document.getElementById("root")
);

// yarn add redux --save-dev
// yarn add react-redux --save-dev
// yarn add uuid --save-dev (id unique)
// yarn add redux-thunk --save-dev (asynchronous actions)


// REDUX SAGA
/* React Redux tutorial: writing your first Redux Saga
In the previous sections we built a Post component which calls this.props.getData upon mounting to the DOM. getData is an asynchronous Redux action based on Redux thunk. That action is in charge for getting data from the remote API.

In this section we will refactor our code to use a Redux saga instead of a thunk. I won’t cover the entire Saga API in this post so please bear with me. We’ll just take a look at a bunch of methods.

Before getting started install redux saga with:

npm i redux-saga --save-dev
Now we can refactor our async action and remove the fetch call. From now on our action creator will just dispatch a plain action. Open up src/js/actions/index.js and modify getData to return a plain action named DATA_REQUESTED:

export function getData() {
  return { type: "DATA_REQUESTED" };
}
This very DATA_REQUESTED action will be “intercepted” by Redux saga with the takeEvery method. You can imagine takeEvery “taking” every DATA_REQUESTED action passing inside our app and starting some work in response to that action.

Earlier we saw that a redux saga could be a single file containing:

a watcher function
a worker function
The watcher is basically a generator function “watching” for every action we are interested in. In response to that action, the watcher will call a worker saga, which is another generator function for doing the actual API call.

The worker saga will call the remote API with the call method from redux-saga/effects. When the data is loaded we can dispatch another action from our saga with the put method, again, from redux-saga/effects. Makes sense?

Armed with this knowledge we can lay down our first redux saga! First create a new folder for holding your sagas:

mkdir -p src/js/sagas
and then create a new file named api-saga.js in src/js/sagas. And here’s our saga:

import { takeEvery, call, put } from "redux-saga/effects";
export default function* watcherSaga() {
  yield takeEvery("DATA_REQUESTED", workerSaga);
}
function* workerSaga() {
  try {
    const payload = yield call(getData);
    yield put({ type: "DATA_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}
Let’s break down the logic flow of our saga. We can read the code like so:

take every action named DATA_REQUESTED and for each action of that type spin a worker saga
inside the worker saga call a function named getData
if the function does not result in any error then dispatch (put) a new action named DATA_LOADED, alongside with a payload
if the function results in an error then dispatch (put) a new action named API_ERRORED, alongside with a payload (the error)
The only thing we’re missing in our code is the getData function. Open up src/js/sagas/api-saga.js again and add the function:

import { takeEvery, call, put } from "redux-saga/effects";
export default function* watcherSaga() {
  yield takeEvery("DATA_REQUESTED", workerSaga);
}
function* workerSaga() {
  try {
    const payload = yield call(getData);
    yield put({ type: "DATA_LOADED", payload });
  } catch (e) {
    yield put({ type: "API_ERRORED", payload: e });
  }
}
function getData() {
  return fetch("https://jsonplaceholder.typicode.com/posts").then(response =>
    response.json()
  );
}
And finally we can wire up redux saga to our redux store. Open up src/js/store/index.js and update the store as follows:

// src/js/store/index.js
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import { forbiddenWordsMiddleware } from "../middleware";
import createSagaMiddleware from "redux-saga";
import apiSaga from "../sagas/api-saga";
const initialiseSagaMiddleware = createSagaMiddleware();
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  storeEnhancers(
    applyMiddleware(forbiddenWordsMiddleware, initialiseSagaMiddleware)
  )
);
initialiseSagaMiddleware.run(apiSaga);
export default store;
Worth noting in this file the createSagaMiddleware method and initialiseSagaMiddleware.run for running our saga.

Now close and save the file. Run npm start and ta-da! You should see the exact same output again with the remote posts correctly displaying in the browser.

Congratulations! You created your first redux saga!

An exercise for you: our reducer was ready for handling DATA_LOADED alonside with its payload. Complete the reducer for dealing with API_ERRORED.

An exercise for you: move DATA_LOADED, API_ERRORED, and DATA_REQUESTED inside named constants.

An exercise for you: do we need to better account for fetch errors inside getData? */
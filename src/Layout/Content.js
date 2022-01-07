import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import React from 'react'
import User from '../Components/Master/User'

function Content() {
	return (
		<div>
			<BrowserRouter>
				<Switch>
				<Route exact path="/">
						HAHA
					</Route>
					<Route path="/user1">
						<User title="TES" />
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default Content

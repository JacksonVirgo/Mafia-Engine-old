import React from "react";
import SideNav, {
    Toggle,
    Nav,
    NavItem,
    NavIcon,
    NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

class NavigationBar extends React.Component {
    eventKeyFired(eventKey, event) {
        this.props.setFocus(eventKey, event);
    }
    render() {
        return (
            <SideNav onSelect={this.eventKeyFired.bind(this)}>
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="import">
                    <NavItem eventKey="import">
                        <NavText>Import Data</NavText>
                    </NavItem>
                    <NavItem eventKey="export">
                        <NavText>Export Data</NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        );
    }
}

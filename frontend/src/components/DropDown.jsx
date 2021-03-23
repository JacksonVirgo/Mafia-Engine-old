import React from 'react';
import PropTypes from 'prop-types';
import style from '../css/modules/component.module.css';

export default class DropDown extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		label: PropTypes.string.isRequired,
		children: PropTypes.node,
		onChange: PropTypes.func,
	};
	static defaultProps = {
		isOpen: false,
		label: 'DropDown',
		children: null,
	};
	state = {
		isOpen: this.props.isOpen,
	};
	render() {
		const { label, children } = this.props;
		const { isOpen } = this.state;
		return (
			<div className={style.wrapper}>
				<div className={style.dropToggler} onClick={this.toggleDropDown} ref={(ref) => (this.dropTogglerRef = ref)}>
					<span className={style.label}>{label}</span>
					<span className={style.arrow}>{isOpen ? '\u25B2' : '\u25BC'}</span>
				</div>
				<div className={style.displayArea}>
					{isOpen && (
						<div className={style.children} ref={(ref) => (this.displayAreaRef = ref)}>
							{children}
						</div>
					)}
				</div>
			</div>
		);
	}
}

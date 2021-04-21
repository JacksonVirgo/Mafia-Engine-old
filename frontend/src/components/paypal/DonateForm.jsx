import React, { useState, useEffect } from 'react';

export default function DonateForm() {
	return (
		<form action='https://www.paypal.com/donate' method='post' target='_top'>
			<input type='hidden' name='business' value='UB345V3UDGXXQ' />
			<input type='hidden' name='item_name' value='Help me keep the site up for everyone to use! Every cent will be spent on the development and hosting this service!' />
			<input type='hidden' name='currency_code' value='AUD' />
			{/* <input type='image' src='https://www.paypalobjects.com/en_AU/i/btn/btn_donateCC_LG.gif' border='0' name='submit' title='PayPal - The safer, easier way to pay online!' alt='Donate with PayPal button' /> */}
			<input type='image' src='../../img/buttonDonate.png' border='0' name='submit' title='PayPal - The safer, easier way to pay online!' alt='Donate with PayPal button' />
			<img alt='' border='0' src='https://www.paypal.com/en_AU/i/scr/pixel.gif' width='1' height='1' />
		</form>
	);
}

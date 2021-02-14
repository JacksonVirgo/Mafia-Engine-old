import React from 'react'

function LoginForm() {
    return (
        <form>
            <div className='formInner'>
                {/* Error Handling */}
                <div className='formGroup'>
                    <label htmlFor='token'>Authorization Token</label>
                    <input type='password' id='token' name='token' />
                </div>
                <input type='submit' value='Authorize' />
            </div>
        </form>
    )
}

export default LoginForm;

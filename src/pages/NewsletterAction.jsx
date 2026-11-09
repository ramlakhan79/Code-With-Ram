import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/ui/Button';

// Confirming or unsubscribing needs a click, so link-scanning email software cannot do it by accident
export default function NewsletterAction() {
  const { action } = useParams();
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState({ busy: false, message: '', error: '' });
  const unsub = action === 'unsubscribe';

  const go = async () => {
    setState({ busy: true, message: '', error: '' });
    try { const r = await api.post(`/platform/newsletter/${unsub ? 'unsubscribe' : 'confirm'}`, { token }); setState({ busy: false, message: r.data.message, error: '' }); } catch (e) { setState({ busy: false, message: '', error: getErrorMessage(e) }); }
  };
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-2xl font-bold">{unsub ? 'Unsubscribe from the newsletter' : 'Confirm your subscription'}</h1>
      {!token ? <p className="mt-4 text-muted">This link is incomplete. Open it again from the email.</p> : state.message ? <p role="status" className="mt-4">{state.message}</p> : (
        <>{state.error && <p role="alert" className="mt-4 text-danger">{state.error}</p>}<Button className="mt-6" loading={state.busy} onClick={go}>{unsub ? 'Yes, unsubscribe me' : 'Confirm subscription'}</Button></>
      )}
      <p className="mt-8"><Link to="/" className="text-sm underline">Back to the home page</Link></p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { ErrorState, FormError, Spinner } from '../../components/ui/Feedback';

export default function AdminSettings() {
  const { can } = useAuth();
  const { reload: reloadPublic } = usePlatform();
  const toast = useToast();
  const editable = can('settings:manage');
  const { data, loading, error, reload } = useFetch('/admin/settings');
  const [f, setF] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { const s = data?.settings; if (s) setF({ siteName: s.siteName, contactEmail: s.contactEmail || '', registrationOpen: s.registrationOpen, maintenanceEnabled: Boolean(s.maintenance?.enabled), maintenanceMessage: s.maintenance?.message || '' }); }, [data]);
  if (loading && !data) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!f) return null;
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const save = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      await api.patch('/admin/settings', { siteName: f.siteName, contactEmail: f.contactEmail, registrationOpen: f.registrationOpen, maintenance: { enabled: f.maintenanceEnabled, message: f.maintenanceMessage } });
      toast.success('Settings saved'); reload(); reloadPublic();
    } catch (er) { setErr(er.response?.data?.errors?.map((x) => `${x.field}: ${x.message}`).join(' · ') || getErrorMessage(er)); } finally { setBusy(false); }
  };
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Platform settings</h1>
      {!editable && <p role="status" className="mt-3 rounded-lg border border-line bg-raised p-3 text-sm">You can view these settings. Only a super admin can change them.</p>}
      <form onSubmit={save} className="mt-6 space-y-6" noValidate>
        <FormError>{err}</FormError>
        <fieldset disabled={!editable} className="space-y-5 disabled:opacity-70">
          <Field label="Site name" value={f.siteName} maxLength={60} onChange={(e) => set({ siteName: e.target.value })} />
          <Field label="Public contact email" type="email" value={f.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} hint="Shown on the contact page. Leave empty to show only the form." />
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]" checked={f.registrationOpen} onChange={(e) => set({ registrationOpen: e.target.checked })} /><span><span className="font-medium">Allow new registrations</span><br /><span className="text-muted">Turn off to pause sign-ups (email and Google). Existing users can still log in.</span></span></label>
          <div className="rounded-xl border border-line p-4">
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]" checked={f.maintenanceEnabled} onChange={(e) => set({ maintenanceEnabled: e.target.checked })} /><span><span className="font-medium">Maintenance mode</span><br /><span className="text-muted">Visitors and regular users see a "we'll be right back" page and the API refuses their requests. Admins can still sign in and use the site, so you can finish your work and switch this off.</span></span></label>
            <div className="mt-4"><Field as="textarea" rows={3} label="Message shown to visitors" value={f.maintenanceMessage} maxLength={300} onChange={(e) => set({ maintenanceMessage: e.target.value })} /></div>
          </div>
        </fieldset>
        {editable && <Button type="submit" loading={busy}>Save settings</Button>}
      </form>
    </div>
  );
}

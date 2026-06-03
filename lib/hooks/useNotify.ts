export type NotificationType = 'dissolution_requested' | 'proposal_received' | 'proposal_accepted';

export async function sendNotification(walletAddress: string, type: NotificationType): Promise<void> {
    try {
        const res = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, type }),
        });
        const data = await res.json().catch(() => ({}));
        console.log('[notify] sent', type, 'to', walletAddress, '→', res.status, data);
    } catch (err) {
        console.error('[notify] failed', type, err);
    }
}

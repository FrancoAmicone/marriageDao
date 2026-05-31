export type NotificationType = 'dissolution_requested' | 'proposal_received' | 'proposal_accepted';

export async function sendNotification(walletAddress: string, type: NotificationType): Promise<void> {
    try {
        await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, type }),
        });
    } catch {
        // Notification failure is non-blocking — never interrupts the main flow
    }
}

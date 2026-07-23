import { transporter } from "./mailer";

function baseLayout(bodyHtml: string) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; background:#F6F5F1; padding:32px;">
      <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #DAD7CE; border-radius:8px; overflow:hidden;">
        <div style="background:#1F6F5C; padding:20px 24px;">
          <span style="color:#ffffff; font-size:18px; font-weight:600;">Porikors</span>
        </div>
        <div style="padding:28px 24px; color:#1C2420;">
          ${bodyHtml}
        </div>
        <div style="padding:16px 24px; border-top:1px solid #DAD7CE; color:#1C2420; opacity:0.5; font-size:12px;">
          This is an automated message from Porikors. Please do not reply to this email.
        </div>
      </div>
    </div>
    `;
}

export async function sendApprovalEmail( to: string, name: string, role: string, ) {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const html = baseLayout(`
        <p style="font-size:15px; line-height:1.6;">Hi ${name},</p>
        <p style="font-size:15px; line-height:1.6;">
          Good news — your request to join Porikors as a <strong>${roleLabel}</strong> has been
          <span style="color:#3B8F5C; font-weight:600;">approved</span>.
        </p>
        <p style="font-size:15px; line-height:1.6;">
          You can now log in and start using your ${roleLabel.toLowerCase()} account right away.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/login"
           style="display:inline-block; margin-top:12px; background:#1F6F5C; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:6px; font-size:14px; font-weight:500;">
          Go to Porikors
        </a>
        <p style="font-size:14px; line-height:1.6; margin-top:20px; opacity:0.7;">
          If you weren't expecting this, you can safely ignore this email.
        </p>
    `);

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your Porikors account has been approved",
        html,
    });
}

export async function sendRejectionEmail(to: string, name: string, role: string, reason: string) {
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    const html = baseLayout(`
        <p style="font-size:15px; line-height:1.6;">Hi ${name},</p>
        <p style="font-size:15px; line-height:1.6;">
          Thanks for your interest in joining Porikors as a <strong>${roleLabel}</strong>. After review,
          we're unable to approve your request at this time.
        </p>
        <div style="margin:16px 0; padding:12px 14px; background:#F6F5F1; border-left:3px solid #C1443D; border-radius:4px;">
          <p style="font-size:13px; font-weight:600; margin:0 0 4px 0; opacity:0.7;">Reason provided</p>
          <p style="font-size:14px; margin:0; line-height:1.5;">${reason}</p>
        </div>
        <p style="font-size:15px; line-height:1.6;">
          You're welcome to submit a new request once you've addressed the point above.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify"
           style="display:inline-block; margin-top:8px; background:#1C2420; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:6px; font-size:14px; font-weight:500;">
          Submit again
        </a>
    `);

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Update on your Porikors verification request",
        html,
    });
}

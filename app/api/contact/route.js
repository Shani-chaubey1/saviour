import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';
import { parseAndValidateLeadBody } from '@/lib/leadSubmission';
import { sendLeadToCrm, buildCrmLeadFromEnquiry } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const data = parseAndValidateLeadBody(body);
    await connectDB();
    await Enquiry.create({
      name: data.name,
      email: data.email || '',
      phone: data.phone,
      message: data.message || '',
      project: data.project,
      source: 'website',
      formType: data.formType,
      preferredDateTime: data.preferredDateTime || null,
      visitDate: data.visitDate || '',
      visitTime: data.visitTime || '',
    });

    // CRM push — log failures; never blocks the user response.
    sendLeadToCrm(buildCrmLeadFromEnquiry(data))
      .then((crmResult) => {
        if (!crmResult.sent) {
          console.error('[CRM] lead not sent:', crmResult.reason || crmResult.error || crmResult);
        }
      })
      .catch((crmErr) => {
        console.error('[CRM] unexpected error:', crmErr);
      });

    return NextResponse.json({ success: true, message: 'Enquiry submitted successfully' });
  } catch (err) {
    const status = err.status || 500;
    if (status !== 500) {
      return NextResponse.json({ error: err.message || 'Bad request' }, { status });
    }
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

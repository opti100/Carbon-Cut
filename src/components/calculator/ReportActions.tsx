import { ActivityData, OrganizationData } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";


interface ReportActionsProps {
  organization: OrganizationData;
  activities: ActivityData[];
  getDisplayCO2: (activity: ActivityData) => number;
  totals: {
    total: number;
    byChannel: Record<string, number>;
    byMarket: Record<string, number>;
    byScope: Record<string, number>;
  };
}

export default function ReportActions({ organization, activities, getDisplayCO2, totals }: ReportActionsProps) {
  const exportCSV = () => {
    if (activities.length === 0) {
      alert('Please add some marketing activities before exporting.');
      return;
    }
    const headers = ["Date", "Market", "Campaign", "Channel", "Scope", "Activity", "Quantity", "CO2e_kg"];
    const rows = activities.map(activity => [
      activity.date,
      activity.market,
      activity.campaign || "",
      activity.channel,
      activity.scope.toString(),
      activity.activityLabel,
      activity.qty.toString(),
      (Math.round(getDisplayCO2(activity) * 10000) / 10000).toString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const orgName = organization.name ? organization.name.replace(/[^a-zA-Z0-9]/g, '_') : 'CarbonCut';
    a.download = `${orgName}_Marketing_Emissions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (activities.length === 0) {
      alert('Please add some marketing activities before generating a report.');
      return;
    }

    try {
      const doc = new jsPDF();
      const totalEmissions = totals.total;
      const now = new Date();
      const reportDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      
      // Simplified PDF for brevity. You can expand this with your original detailed design.
      doc.setFontSize(18);
      doc.text('CarbonCut Marketing Emissions Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`For: ${organization.name || 'N/A'}`, 14, 32);
      doc.text(`Period: ${organization.period || 'N/A'}`, 14, 38);
      doc.text(`Report Date: ${reportDate}`, 14, 44);

      doc.setFontSize(14);
      doc.text(`Total Emissions: ${totalEmissions.toFixed(4)} kg CO₂e`, 14, 60);

      doc.setFontSize(12);
      doc.text('Activity Breakdown:', 14, 70);
      
      let yPos = 78;
      activities.forEach((activity, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const activityText = `${activity.date} | ${activity.channel} | ${activity.activityLabel} (${activity.qty}) | ${getDisplayCO2(activity).toFixed(4)} kg CO₂e`;
        doc.setFontSize(9);
        doc.text(activityText, 14, yPos);
        yPos += 7;
      });

      const orgName = organization.name ? organization.name.replace(/[^a-zA-Z0-9]/g, '_') : 'CarbonCut';
      const fileName = `${orgName}_Carbon_Footprint_Report_${now.toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const contactCarbonCut = () => {
    const org = organization.name || "Brand";
    const period = organization.period || "";
    const total = totals.total;
    const body = encodeURIComponent(
      `Hi CarbonCut team,\n\nWe'd like help offsetting our marketing emissions.${period ? ` Reporting period: ${period}.` : ""}\nOrganisation: ${org}\nTotal estimated CO2e: ${total.toFixed(2)} kg.\n\nThanks!`
    );
    window.location.href = `mailto:hello@optiminastic.com?subject=Offset with CarbonCut&body=${body}`;
  };

  return (
    <Card>
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold">Want to neutralise your impact?</h4>
          <p className="text-sm text-muted-foreground">
            Talk to us about insetting/offsetting options and how to reduce future emissions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
          <Button variant="outline" onClick={downloadPDF}>Download PDF</Button>
          <Button onClick={contactCarbonCut}>Offset with CarbonCut</Button>
        </div>
      </CardContent>
    </Card>
  );
}
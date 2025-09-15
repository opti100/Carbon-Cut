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
      
      // Color scheme for professional look
      const primaryColor: [number, number, number] = [41, 128, 185]; // Professional blue
      const accentColor: [number, number, number] = [52, 152, 219]; // Lighter blue
      const textColor: [number, number, number] = [44, 62, 80]; // Dark blue-gray
      const lightGray: [number, number, number] = [236, 240, 241];
      
      // Set up page margins
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // HEADER SECTION - Professional and minimal
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Company logo area (you can add actual logo later)
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('CarbonCut', margin, 22);
      
      // Report type
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('Marketing Emissions Report', margin, 30);
      
      // Report date - right aligned
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const dateWidth = doc.getTextWidth(reportDate);
      doc.text(reportDate, pageWidth - margin - dateWidth, 30);
      
      // ORGANIZATION INFO SECTION
      let yPos = 55;
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Organization Details', margin, yPos);
      
      yPos += 15;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Organization info in clean format
      doc.setFont('helvetica', 'bold');
      doc.text('Organization:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(organization.name || 'N/A', margin + 35, yPos);
      
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Reporting Period:', margin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(organization.period || 'N/A', margin + 45, yPos);
      
      // SUMMARY SECTION - Highlighted box
      yPos += 25;
      doc.setFillColor(...lightGray);
      doc.roundedRect(margin, yPos - 5, pageWidth - (2 * margin), 35, 3, 3, 'F');
      
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Emissions Summary', margin + 10, yPos + 8);
      
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(`${totalEmissions.toFixed(2)} kg CO₂e`, margin + 10, yPos + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Total Marketing Emissions', margin + 10, yPos + 26);
      
      // BREAKDOWN BY CATEGORY
      yPos += 55;
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Emissions Breakdown', margin, yPos);
      
      yPos += 15;
      
      // By Channel breakdown
      if (Object.keys(totals.byChannel).length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('By Channel:', margin, yPos);
        yPos += 8;
        
        Object.entries(totals.byChannel).forEach(([channel, emissions]) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(`• ${channel}:`, margin + 5, yPos);
          doc.text(`${emissions.toFixed(2)} kg CO₂e`, margin + 80, yPos);
          yPos += 6;
        });
        yPos += 5;
      }
      
      // By Market breakdown
      if (Object.keys(totals.byMarket).length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('By Market:', margin, yPos);
        yPos += 8;
        
        Object.entries(totals.byMarket).forEach(([market, emissions]) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(`• ${market}:`, margin + 5, yPos);
          doc.text(`${emissions.toFixed(2)} kg CO₂e`, margin + 80, yPos);
          yPos += 6;
        });
      }
      
      // ACTIVITIES TABLE HEADER
      yPos += 20;
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Activity Details', margin, yPos);
      
      yPos += 15;
      
      // Table header
      doc.setFillColor(...primaryColor);
      doc.rect(margin, yPos - 3, pageWidth - (2 * margin), 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9); 
      doc.text('Date', margin + 2, yPos + 5);
      doc.text('Channel', margin + 25, yPos + 5);
      doc.text('Market', margin + 55, yPos + 5);
      doc.text('Activity', margin + 80, yPos + 5);
      doc.text('Qty', margin + 120, yPos + 5);
      doc.text('CO₂e (kg)', margin + 140, yPos + 5);
      
      yPos += 15;
      
      // Activity rows
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      activities.forEach((activity, index) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 30;
        }
        
        // Alternating row colors for readability
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, yPos - 3, pageWidth - (2 * margin), 10, 'F');
        }
        
        doc.text(activity.date, margin + 2, yPos + 3);
        doc.text(activity.channel, margin + 25, yPos + 3);
        doc.text(activity.market, margin + 55, yPos + 3);
        
        // Truncate long activity names
        const activityText = activity.activityLabel.length > 20 
          ? activity.activityLabel.substring(0, 17) + '...' 
          : activity.activityLabel;
        doc.text(activityText, margin + 80, yPos + 3);
        
        doc.text(activity.qty.toString(), margin + 120, yPos + 3);
        doc.text(getDisplayCO2(activity).toFixed(3), margin + 140, yPos + 3);
        
        yPos += 10;
      });
      
      // FOOTER
      const footerY = pageHeight - 20;
      doc.setDrawColor(...lightGray);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      doc.setTextColor(128, 128, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('CarbonCut by Optiminastic | Professional Carbon Footprint Analysis', margin, footerY);
      
      const pageText = `Page 1`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageTextWidth, footerY);

      const orgName = organization.name ? organization.name.replace(/[^a-zA-Z0-9]/g, '_') : 'CarbonCut';
      const fileName = `${orgName}_Carbon_Emissions_Report_${now.toISOString().slice(0, 10)}.pdf`;
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
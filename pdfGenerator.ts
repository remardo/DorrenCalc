import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DoorConfig, DOOR_TYPES } from './types';
import { calculateItemTotal } from './priceCalculator';

interface PDFGeneratorProps {
  projectItems: DoorConfig[];
  projectName: string;
  customerName: string;
  managerName: string;
  comments: string;
  projectTotal: number;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const loadAndRegisterFont = async (
  doc: jsPDF,
  path: string,
  vfsName: string,
  fontStyle: 'normal' | 'bold'
) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load font: ${path}`);
  const base64 = arrayBufferToBase64(await res.arrayBuffer());
  doc.addFileToVFS(vfsName, base64);
  doc.addFont(vfsName, 'ArialLocal', fontStyle as any, 'Identity-H');
};

export const generatePDF = async ({
  projectItems,
  projectName,
  customerName,
  managerName,
  comments,
  projectTotal
}: PDFGeneratorProps) => {
  const doc = new jsPDF();
  const vatRate = 0.2;
  const vatAmount = Math.round(projectTotal * vatRate);
  const totalWithVat = projectTotal + vatAmount;

  try {
    await loadAndRegisterFont(doc, '/fonts/Arial.ttf', 'Arial.ttf', 'normal');
    await loadAndRegisterFont(doc, '/fonts/Arial.ttf', 'Arial.ttf', 'bold');
    doc.setFont('ArialLocal', 'normal');
  } catch (error) {
    console.warn('Could not load local Arial font, falling back to built-in Helvetica.', error);
    doc.setFont('helvetica', 'normal');
  }

  const bgBlack = '#000000';
  const textWhite = '#FFFFFF';
  const accentBlue = '#85CEE4';
  const darkBlue = '#183141';

  doc.setFillColor(bgBlack);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(textWhite);
  doc.setFontSize(24);
  doc.text('DORREN', 15, 20);

  doc.setDrawColor(accentBlue);
  doc.setLineWidth(0.5);
  doc.line(15, 22, 50, 22);

  doc.setFontSize(8);
  doc.setTextColor(accentBlue);
  doc.text('Профессиональные дверные решения', 15, 26);

  doc.setTextColor(textWhite);
  doc.setFontSize(20);
  doc.text('Коммерческое предложение', 105, 20, { align: 'center' });

  const startY = 40;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);

  doc.text('Дата:', 15, startY);
  doc.setTextColor(textWhite);
  doc.text(new Date().toLocaleDateString('ru-RU'), 15, startY + 5);

  doc.setTextColor(150, 150, 150);
  doc.text('Менеджер:', 60, startY);
  doc.setTextColor(textWhite);
  doc.text(managerName || 'не указан', 60, startY + 5);

  doc.setTextColor(150, 150, 150);
  doc.text('Клиент:', 15, startY + 15);
  doc.setTextColor(textWhite);
  doc.text(customerName || 'не указан', 15, startY + 20);

  doc.setTextColor(150, 150, 150);
  doc.text('Проект:', 60, startY + 15);
  doc.setTextColor(textWhite);
  doc.text(projectName || 'без названия', 60, startY + 20);

  if (comments) {
    doc.setTextColor(150, 150, 150);
    doc.text('Комментарии:', 15, startY + 30);
    doc.setTextColor(textWhite);
    const splitComments = doc.splitTextToSize(comments, 180);
    doc.text(splitComments, 15, startY + 35);
  }

  const tableBody: any[] = [];

  DOOR_TYPES.forEach(type => {
    const typeItems = projectItems.filter(i => i.doorType === type.id);
    if (typeItems.length === 0) return;

    tableBody.push([
      {
        content: type.label.toUpperCase(),
        colSpan: 3,
        styles: { fillColor: darkBlue, textColor: accentBlue, fontStyle: 'bold', font: 'ArialLocal' }
      }
    ]);

    typeItems.forEach(item => {
      const leafName = item.leaf?.name || 'Полотно не выбрано';
      const frameName = item.frame?.name || 'Короб не выбран';

      let details = `${frameName}`;
      const extras = [...item.options, ...item.hardware, ...(item.accessories || [])];
      if (extras.length > 0) {
        details += `\n${extras.map(e => `• ${e.name}`).join('\n')}`;
      }

      if (item.discount) {
        const discountText =
          item.discount.type === 'percent'
            ? `Скидка: ${item.discount.value}%`
            : `Скидка: ${item.discount.value} ₽`;
        details += `\n\n[${discountText}]`;
      }

      const discVal = item.discount?.value.toString();
      const discType = item.discount?.type;
      const total = calculateItemTotal(
        item.leaf,
        item.frame,
        item.options,
        item.hardware,
        item.accessories,
        item.quantity,
        discVal,
        discType
      );

      tableBody.push([
        leafName + '\n' + details,
        item.quantity,
        total.toLocaleString('ru-RU') + ' ₽'
      ]);
    });
  });

  autoTable(doc, {
    startY: comments ? startY + 50 : startY + 35,
    head: [['Описание / комплектация', 'Кол-во', 'Итого']],
    body: tableBody,
    theme: 'grid',
    styles: {
      font: 'ArialLocal',
      fontStyle: 'normal',
      fontSize: 9,
      textColor: 255,
      fillColor: '#000000',
      lineWidth: 0.1,
      lineColor: '#333333',
      cellPadding: 4
    },
    headStyles: {
      fillColor: '#101010',
      textColor: [100, 100, 100],
      fontStyle: 'bold',
      halign: 'left',
      font: 'ArialLocal'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: '#080808'
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Итого без НДС:', 195, finalY, { align: 'right' });

  doc.setFontSize(18);
  doc.setTextColor(accentBlue);
  doc.text(`${projectTotal.toLocaleString('ru-RU')} ₽`, 195, finalY + 8, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('НДС 20%:', 195, finalY + 22, { align: 'right' });

  doc.setFontSize(14);
  doc.setTextColor(textWhite);
  doc.text(`${vatAmount.toLocaleString('ru-RU')} ₽`, 195, finalY + 30, { align: 'right' });

  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text('Итого с НДС:', 195, finalY + 44, { align: 'right' });

  doc.setFontSize(22);
  doc.setTextColor(accentBlue);
  doc.text(`${totalWithVat.toLocaleString('ru-RU')} ₽`, 195, finalY + 54, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text('DORREN — стальные двери | dorren.ru', 105, 290, { align: 'center' });

  doc.save(`KP_DORREN_${projectName || 'Project'}.pdf`);
};

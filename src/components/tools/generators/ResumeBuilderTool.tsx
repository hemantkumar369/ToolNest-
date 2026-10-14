import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { UserCheck, Plus, Trash2, Download, Eye, Sparkles } from 'lucide-react';

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  desc: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export const ResumeBuilderTool: React.FC = () => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [title, setTitle] = useState('Senior Full Stack Engineer');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+1 (555) 349-2810');
  const [location, setLocation] = useState('San Francisco, CA');
  const [summary, setSummary] = useState(
    'Innovative Software Engineer with 6+ years of experience architecting high-scale distributed web applications, optimizing browser-based data processing, and delivering scalable cloud solutions.'
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      role: 'Lead Web Architect',
      company: 'TechFlow Systems',
      period: '2022 - Present',
      desc: 'Architected browser-based real-time document transformation engines reducing server compute costs by 65%. Mentored engineering squads of 8 developers.'
    },
    {
      id: '2',
      role: 'Full Stack Developer',
      company: 'Nexus Digital',
      period: '2019 - 2022',
      desc: 'Developed responsive client-side SPA web applications serving over 500,000 monthly active users. Implemented automated CI/CD deployment pipelines.'
    }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2015 - 2019'
    }
  ]);

  const [skills, setSkills] = useState('TypeScript, React, Node.js, Next.js, Tailwind CSS, PostgreSQL, WebAssembly, Git, Docker, System Architecture');

  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      { id: `${Date.now()}`, role: 'Role Title', company: 'Company Name', period: '2020 - 2021', desc: 'Responsibilities and accomplishments' }
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, val: string) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const addEducation = () => {
    setEducations(prev => [
      ...prev,
      { id: `${Date.now()}`, degree: 'Degree Title', school: 'University Name', year: '2020' }
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations(prev => prev.filter(e => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, val: string) => {
    setEducations(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      // Name & Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text(fullName, 40, 50);

      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text(title, 40, 68);

      // Contact Line
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`${email}  •  ${phone}  •  ${location}`, 40, 84);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.line(40, 94, 555, 94);

      let y = 115;

      // Summary
      if (summary) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text('PROFESSIONAL SUMMARY', 40, y);
        y += 14;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const sumLines = doc.splitTextToSize(summary, 515);
        doc.text(sumLines, 40, y);
        y += sumLines.length * 13 + 12;
      }

      // Experience
      if (experiences.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text('WORK EXPERIENCE', 40, y);
        y += 14;

        experiences.forEach(exp => {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(30, 41, 59);
          doc.text(exp.role, 40, y);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(`${exp.company}  |  ${exp.period}`, 40, y + 12);

          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          const descLines = doc.splitTextToSize(exp.desc, 515);
          doc.text(descLines, 40, y + 25);

          y += 25 + descLines.length * 12 + 10;
        });
      }

      // Education
      if (educations.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text('EDUCATION', 40, y);
        y += 14;

        educations.forEach(edu => {
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          doc.text(edu.degree, 40, y);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text(`${edu.school}  (${edu.year})`, 40, y + 12);

          y += 24;
        });
        y += 6;
      }

      // Skills
      if (skills) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text('KEY SKILLS & TECHNOLOGIES', 40, y);
        y += 14;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const skillLines = doc.splitTextToSize(skills, 515);
        doc.text(skillLines, 40, y);
      }

      doc.save(`${fullName.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate resume PDF.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">ATS Compliance Guarantee</span>
          <p className="text-xs text-slate-500">Pure selectable text format designed to score 100% on HR applicant filters.</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Resume PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">Personal Information</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Professional Headline"
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="City, State / Country"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Professional Summary</span>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Work Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Work Experience</span>
              <button
                onClick={addExperience}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </button>
            </div>

            {experiences.map(exp => (
              <div key={exp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                    placeholder="Role"
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company"
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={e => updateExperience(exp.id, 'period', e.target.value)}
                    placeholder="Dates"
                    className="w-24 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={exp.desc}
                  onChange={e => updateExperience(exp.id, 'desc', e.target.value)}
                  rows={2}
                  placeholder="Key accomplishments and duties"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Key Skills (Comma-separated)</span>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        {/* Live Resume Sheet Preview */}
        <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl shadow-md font-sans text-slate-800 space-y-4 max-h-[620px] overflow-y-auto">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{fullName}</h2>
            <p className="text-xs font-bold text-blue-600 mt-0.5">{title}</p>
            <p className="text-[11px] text-slate-500 mt-1">{email} • {phone} • {location}</p>
          </div>

          {summary && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 border-b pb-0.5">Summary</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
            </div>
          )}

          {experiences.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-0.5">Experience</h3>
              <div className="space-y-3">
                {experiences.map(exp => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal">{exp.period}</span>
                    </div>
                    <div className="text-[11px] text-blue-600 font-medium mb-1">{exp.company}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 border-b pb-0.5">Skills</h3>
              <p className="text-xs text-slate-600">{skills}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  HeartHandshake,
  Utensils,
  HeartPulse,
  Home,
  LifeBuoy,
  Sparkles,
  ShieldCheck,
  Receipt,
  Download,
  Printer,
  X,
  CheckCircle2,
  Package,
  TrendingUp,
  CreditCard,
  QrCode,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Truck,
  LogOut,
  Plus,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonationCause, DonationRecord, SupplyDonationPledge } from '../../types';
import { NgoLogin } from './NgoLogin';

export const DonationCenterPage: React.FC = () => {
  const {
    donationCauses,
    donationRecords,
    reliefExpenditures,
    supplyPledges,
    addDonation,
    addSupplyPledge,
    addReliefExpenditure,
    ngoEmployeeSessionId,
    ngoOrgName,
    logoutNgoEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState<'causes' | 'supplies' | 'transparency' | 'history'>('causes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // NGO Expenditure Modal State
  const [showAddExpenditureModal, setShowAddExpenditureModal] = useState(false);
  const [expItem, setExpItem] = useState('');
  const [expCategory, setExpCategory] = useState('food_water');
  const [expAmount, setExpAmount] = useState('150000');
  const [expQuantity, setExpQuantity] = useState('3000 Food Packets & Water');
  const [expVendor, setExpVendor] = useState('Annapurna Central Kitchens');
  const [expDestination, setExpDestination] = useState('Vijayawada Flood Relief Camps');

  // Donation Modal State
  const [selectedCause, setSelectedCause] = useState<DonationCause | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [panNumber, setPanNumber] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Receipt Modal State
  const [completedReceipt, setCompletedReceipt] = useState<DonationRecord | null>(null);

  // Supply Pledge Form State
  const [supplyDonorName, setSupplyDonorName] = useState('');
  const [supplyPhone, setSupplyPhone] = useState('');
  const [supplyItemType, setSupplyItemType] = useState('Drinking Water Cans (20L)');
  const [supplyQuantity, setSupplyQuantity] = useState('20');
  const [supplyUnit, setSupplyUnit] = useState('Cans');
  const [supplyLocation, setSupplyLocation] = useState('');
  const [supplyNotes, setSupplyNotes] = useState('');
  const [supplyPledgeSuccess, setSupplyPledgeSuccess] = useState(false);

  const handleAddExpenditureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expItem || !expAmount) return;

    addReliefExpenditure({
      causeCategory: expCategory,
      allocatedAmount: Number(expAmount),
      itemDispatched: expItem,
      quantity: expQuantity,
      vendorOrOrg: expVendor,
      destination: expDestination,
      verifiedBy: `${ngoEmployeeSessionId || 'NGO-EMP-802'} (${ngoOrgName || 'Annapurna Relief Foundation'})`
    });

    setShowAddExpenditureModal(false);
    setExpItem('');
    setExpAmount('150000');
  };

  // Metrics Calculations
  const totalRaisedMoney = donationCauses.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalTargetMoney = donationCauses.reduce((acc, c) => acc + c.targetAmount, 0);
  const totalSpentMoney = reliefExpenditures.reduce((acc, e) => acc + e.allocatedAmount, 0);
  const foodAndWaterFunds = donationCauses.find(c => c.category === 'food_water')?.raisedAmount || 0;
  
  // Approximate impact stats
  const foodPacketsFunded = Math.floor(foodAndWaterFunds / 50); // ₹50 per meal packet
  const donorsCount = donationRecords.length + 1840; // Base baseline + live

  const filteredCauses = donationCauses.filter(c => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const getEffectiveAmount = () => {
    if (customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) {
      return Number(customAmount);
    }
    return donationAmount;
  };

  // Calculate dynamic impact preview string based on amount
  const getImpactPreview = (amt: number) => {
    if (amt <= 250) return `Provides 5 Emergency Cooked Hot Meals & 10L Drinking Water`;
    if (amt <= 500) return `Provides 10 Meal Kits + 2 Warm Blankets for displaced families`;
    if (amt <= 1000) return `Provides 20 Meal Kits + 1 Emergency Paramedic Medical First Aid Pouch`;
    if (amt <= 2500) return `Provides 50 Hot Meals + 5 Life Jackets & Waterproof Tarpaulin Roof`;
    if (amt <= 5000) return `Feeds 1 Displaced Family of 4 for 2 Full Weeks + Full Hygiene Pack`;
    return `Provides 100+ Emergency Meals, Medical Care & Temporary Shelter Kit`;
  };

  const handleOpenDonateModal = (cause?: DonationCause) => {
    setSelectedCause(cause || donationCauses[0]);
    setDonationAmount(1000);
    setCustomAmount('');
    setIsSubmitting(false);
  };

  const handleExecuteDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCause) return;

    const finalAmount = getEffectiveAmount();
    if (finalAmount <= 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const receipt = addDonation({
        donorName: isAnonymous ? 'Anonymous Supporter' : (donorName || 'Generous Benefactor'),
        donorEmail: donorEmail || 'donor@resq-relief.org',
        donorPhone,
        amount: finalAmount,
        causeId: selectedCause.id,
        causeTitle: selectedCause.title,
        paymentMethod,
        impactSummary: getImpactPreview(finalAmount),
        anonymous: isAnonymous,
        panNumber
      });

      setIsSubmitting(false);
      setSelectedCause(null);
      setCompletedReceipt(receipt);
    }, 1200);
  };

  const handleSupplyPledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyDonorName || !supplyPhone || !supplyLocation) return;

    addSupplyPledge({
      donorName: supplyDonorName,
      phone: supplyPhone,
      itemType: supplyItemType,
      quantity: supplyQuantity,
      unit: supplyUnit,
      location: supplyLocation,
      notes: supplyNotes
    });

    setSupplyPledgeSuccess(true);
    setTimeout(() => {
      setSupplyPledgeSuccess(false);
      setSupplyDonorName('');
      setSupplyPhone('');
      setSupplyLocation('');
      setSupplyNotes('');
    }, 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* NGO RELIEF CENTER CONTROL RIBBON */}
      <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white font-bold shadow-md">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                NGO Relief & Donation Center
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white">
                {ngoEmployeeSessionId || 'NGO-OPEN-ACCESS'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium mt-0.5">
              Managing Organization: <strong>{ngoOrgName || 'Annapurna Relief Foundation'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddExpenditureModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Relief Expenditure</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION — RELIEF FUND & FOOD DONATION CENTER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-rose-600 to-red-700 text-white p-6 sm:p-10 shadow-2xl border border-amber-400/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30">
            <HeartHandshake className="w-4 h-4 text-amber-200" />
            <span>DISASTER RELIEF & FOOD SECURITY FUND</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            ResQ Disaster Relief & Food Donation Center
          </h1>

          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
            100% of your contributions directly purchase fresh food packets, clean water cans, trauma medical kits, and warm blankets for families stranded in disaster zones across India.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => handleOpenDonateModal(donationCauses[0])}
              className="px-6 py-3 bg-white text-rose-700 hover:bg-amber-50 font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              <span>Donate Food & Emergency Funds Now</span>
            </button>

            <button
              onClick={() => setActiveTab('supplies')}
              className="px-5 py-3 bg-black/30 hover:bg-black/40 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all"
            >
              <Package className="w-4 h-4 text-amber-200" />
              <span>Pledge Physical Food / Supplies</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <HeartHandshake className="absolute -right-8 -bottom-8 w-72 h-72 text-white/10 pointer-events-none rotate-12" />
      </div>

      {/* LIVE IMPACT SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Total Funds Raised
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            ₹{(totalRaisedMoney).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Target: ₹{(totalTargetMoney).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Hot Meals & Water
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {(foodPacketsFunded).toLocaleString('en-IN')}+
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Meal boxes & 20L water cans
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            Funds Allocated
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            ₹{(totalSpentMoney).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Transparently dispatched
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
            Generous Donors
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {donorsCount.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Citizens & Foundations
          </p>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>80G Tax Exempt</span>
          </div>
          <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium leading-tight">
            All monetary contributions qualify for 50% tax exemption under Section 80G. Instant PDF receipt generated.
          </p>
        </div>

      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('causes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === 'causes'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Emergency Causes ({donationCauses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === 'supplies'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pledge Physical Supplies</span>
        </button>

        <button
          onClick={() => setActiveTab('transparency')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === 'transparency'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Fund Expenditure Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Recent Donors Roll</span>
        </button>
      </div>

      {/* TAB 1: EMERGENCY CAUSES */}
      {activeTab === 'causes' && (
        <div className="space-y-6">
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter className="w-4 h-4" />
              <span>Filter Relief Category:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Causes' },
                { id: 'food_water', label: 'Food & Water' },
                { id: 'medical_supplies', label: 'Medical Aid' },
                { id: 'shelter_blankets', label: 'Shelter & Blankets' },
                { id: 'rescue_gear', label: 'Rescue Gear' },
                { id: 'hygiene_kits', label: 'Hygiene & Dignity' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Causes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCauses.map(cause => {
              const percentage = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

              return (
                <div
                  key={cause.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        {cause.category === 'food_water' && <Utensils className="w-6 h-6" />}
                        {cause.category === 'medical_supplies' && <HeartPulse className="w-6 h-6" />}
                        {cause.category === 'shelter_blankets' && <Home className="w-6 h-6" />}
                        {cause.category === 'rescue_gear' && <LifeBuoy className="w-6 h-6" />}
                        {cause.category === 'hygiene_kits' && <Sparkles className="w-6 h-6" />}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          cause.urgencyLevel === 'critical'
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {cause.urgencyLevel} NEED
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                        {cause.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {cause.description}
                      </p>
                    </div>

                    {/* Impact Multiplier Badge */}
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{cause.impactMultiplier}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-bold font-mono">
                        <span className="text-amber-600 dark:text-amber-400">
                          ₹{cause.raisedAmount.toLocaleString('en-IN')} raised
                        </span>
                        <span className="text-slate-400">
                          {percentage}% of ₹{(cause.targetAmount / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDonateModal(cause)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Donate to this Cause</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PLEDGE PHYSICAL SUPPLIES */}
      {activeTab === 'supplies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>DIRECT MATERIAL & FOOD DONATION PLEDGE</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Donate Grains, Bottled Water, Clothes & Blankets
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Have bulk food rations, clean drinking water cans, woolen blankets, or infant formula? Fill in details below to arrange shelter drop-off or volunteer pickup.
              </p>
            </div>

            {supplyPledgeSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-base text-emerald-900 dark:text-emerald-200">
                  Supply Donation Pledge Registered!
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Thank you! ResQ Relief Logistics team will call you within 2 hours to confirm pickup or drop-off center details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSupplyPledgeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      Donor / Org Name:
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Srinivas Rao / Rotary Club"
                      value={supplyDonorName}
                      onChange={e => setSupplyDonorName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number:
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={supplyPhone}
                      onChange={e => setSupplyPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      Item Category:
                    </label>
                    <select
                      value={supplyItemType}
                      onChange={e => setSupplyItemType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                    >
                      <option value="Drinking Water Cans (20L)">Drinking Water Cans (20L)</option>
                      <option value="Rice & Wheat Grain Bags (25kg)">Rice & Wheat Grain Bags (25kg)</option>
                      <option value="Ready-to-Eat Dry Food & Biscuits">Ready-to-Eat Dry Food & Biscuits</option>
                      <option value="Baby Food & Milk Powder">Baby Food & Milk Powder</option>
                      <option value="Woolen Thermal Blankets">Woolen Thermal Blankets</option>
                      <option value="Sanitary Napkins & Hygiene Kits">Sanitary Napkins & Hygiene Kits</option>
                      <option value="Emergency First Aid Medicines">Emergency First Aid Medicines</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      Quantity:
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. 50"
                      value={supplyQuantity}
                      onChange={e => setSupplyQuantity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Pickup Location / Address:
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Benz Circle area, Vijayawada or Relief Drop Point"
                    value={supplyLocation}
                    onChange={e => setSupplyLocation(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Notes / Preferred Pickup Time:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Ready for pickup anytime between 9 AM - 6 PM"
                    value={supplyNotes}
                    onChange={e => setSupplyNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs resize-none outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Submit Physical Supply Pledge</span>
                </button>
              </form>
            )}
          </div>

          {/* Active Supply Pledges List */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>Recent Citizen Supply Pledges ({supplyPledges.length})</span>
            </h3>

            <div className="space-y-3">
              {supplyPledges.map(pledge => (
                <div
                  key={pledge.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {pledge.itemType} ({pledge.quantity} {pledge.unit})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {pledge.pickupStatus}
                    </span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-300 space-y-0.5 text-[11px]">
                    <div><strong>Pledged by:</strong> {pledge.donorName}</div>
                    <div><strong>Location:</strong> {pledge.location}</div>
                    {pledge.notes && <div className="text-slate-400">"{pledge.notes}"</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TRANSPARENCY & EXPENDITURE LEDGER */}
      {activeTab === 'transparency' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Real-time Fund Expenditure Audit Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Every rupee donated is mapped to specific meal distributions, medical purchases, and rescue equipment dispatches.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Audited by Control Center</span>
              </div>
            </div>

            <div className="space-y-3">
              {reliefExpenditures.map(exp => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-600">{exp.id}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {exp.itemDispatched}
                      </span>
                    </div>

                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      ₹{exp.allocatedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div><strong>Category:</strong> {exp.causeCategory}</div>
                    <div><strong>Quantity:</strong> {exp.quantity}</div>
                    <div><strong>Destination:</strong> {exp.destination}</div>
                    <div><strong>Supplier/Vendor:</strong> {exp.vendorOrOrg}</div>
                    <div><strong>Verification Officer:</strong> {exp.verifiedBy}</div>
                    <div><strong>Timestamp:</strong> {new Date(exp.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECENT DONORS ROLL */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            Honour Roll of Generous Donors ({donationRecords.length})
          </h3>

          <div className="space-y-3">
            {donationRecords.map(rec => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {rec.anonymous ? 'Anonymous Donor' : rec.donorName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {rec.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{rec.causeTitle}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{rec.impactSummary}</p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-base font-black text-amber-600 dark:text-amber-400">
                    ₹{rec.amount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{rec.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DONATION MODAL FLOW */}
      {selectedCause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Contribute to Relief Fund
                </h3>
              </div>
              <button onClick={() => setSelectedCause(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Cause Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-amber-700 dark:text-amber-400 block">
                Selected Cause:
              </span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedCause.title}
              </h4>
            </div>

            <form onSubmit={handleExecuteDonation} className="space-y-4">
              
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Donation Amount (₹ INR):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[250, 500, 1000, 2500, 5000].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setDonationAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 rounded-xl font-mono font-bold text-xs transition-all ${
                        donationAmount === amt && !customAmount
                          ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="Or enter custom amount in ₹"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Dynamic Impact Display Box */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{getImpactPreview(getEffectiveAmount())}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Payment Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <span>UPI / GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>Card (Debit/Credit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-5 h-5 text-amber-600" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Donor Contact Details */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      placeholder="E.g. Ramesh Chandra"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                      required={!isAnonymous}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1">Email (for Tax Receipt PDF):</label>
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={donorEmail}
                      onChange={e => setDonorEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">Phone Number (Optional):</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={donorPhone}
                      onChange={e => setDonorPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1">PAN Number (for 80G Tax Exemption):</label>
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={e => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none uppercase"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Make my donation anonymous on public honour roll
                  </span>
                </label>
              </div>

              {/* Execute Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Simulating Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-5 h-5" />
                    <span>Complete Donation of ₹{(getEffectiveAmount()).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETED TAX RECEIPT & GRATITUDE MODAL */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block">
                PAYMENT SUCCESSFUL
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Thank You for Saving Lives!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your contribution has been received and allocated directly to emergency food and relief efforts.
              </p>
            </div>

            {/* Simulated Receipt Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-400">DONATION RECEIPT</span>
                <span className="font-black text-amber-600">{completedReceipt.id}</span>
              </div>

              <div className="space-y-1.5 text-slate-700 dark:text-slate-200">
                <div><strong>Donor:</strong> {completedReceipt.donorName}</div>
                <div><strong>Cause:</strong> {completedReceipt.causeTitle}</div>
                <div className="text-emerald-600 font-bold"><strong>Amount Paid:</strong> ₹{completedReceipt.amount.toLocaleString('en-IN')}</div>
                <div><strong>Txn ID:</strong> {completedReceipt.transactionId}</div>
                <div><strong>Tax Exemption:</strong> Section 80G Compliant</div>
                {completedReceipt.panNumber && <div><strong>PAN:</strong> {completedReceipt.panNumber}</div>}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-sans text-[11px] font-bold">
                Impact: {completedReceipt.impactSummary}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print 80G Receipt</span>
              </button>

              <button
                onClick={() => setCompletedReceipt(null)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NGO EXPENDITURE RECORD CREATION MODAL */}
      {showAddExpenditureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp relative">
            <button
              onClick={() => setShowAddExpenditureModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Record Verified Relief Expenditure
              </h3>
              <p className="text-xs text-slate-500">
                Authorized entry for {ngoEmployeeSessionId} ({ngoOrgName}). Entries are published to the public audited ledger.
              </p>
            </div>

            <form onSubmit={handleAddExpenditureSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  Item / Relief Material Dispatched:
                </label>
                <input
                  type="text"
                  placeholder="E.g., 3000 Ready Cooked Food Kits & Water Bottles"
                  value={expItem}
                  onChange={e => setExpItem(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Amount Spent (₹):
                  </label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Cause Category:
                  </label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold outline-none"
                  >
                    <option value="food_water">Food & Clean Water</option>
                    <option value="medical">Medical & Sanitation</option>
                    <option value="shelter">Shelter & Warmth</option>
                    <option value="rescue_gear">Rescue Boats & Gear</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Vendor / Kitchen Source:
                  </label>
                  <input
                    type="text"
                    value={expVendor}
                    onChange={e => setExpVendor(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Relief Target Destination:
                  </label>
                  <input
                    type="text"
                    value={expDestination}
                    onChange={e => setExpDestination(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Audited Expenditure Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

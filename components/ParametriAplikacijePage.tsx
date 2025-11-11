import React, { useState } from 'react';
import { HomeIcon } from '../constants';

const ParametriAplikacijeBreadcrumbs: React.FC = () => {
    return (
        <div className="bg-white p-3 shadow-sm border border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-500">
                <HomeIcon className="h-5 w-5" />
                <span>&rsaquo;</span>
                <span>Računovodstvo proračuna</span>
                <span>&rsaquo;</span>
                <span>Parametri</span>
                <span>&rsaquo;</span>
                <span className="text-gray-800 font-semibold">Parametri aplikacije</span>
            </div>
        </div>
    );
};


const ParametriAplikacijePage: React.FC = () => {
    const [nivoRada, setNivoRada] = useState<'osnovni' | 'analitika'>('analitika');

    return (
        <>
            <ParametriAplikacijeBreadcrumbs />
            <div className="flex-1 p-6 mt-3 bg-white border border-gray-200 shadow-sm">
                <div className="max-w-md">
                    <fieldset className="border border-gray-300 p-4 rounded-md">
                        <legend className="text-sm font-semibold text-gray-600 px-2">Nivo rada ekonomske klasifikacije</legend>
                        <div className="flex items-center justify-center space-x-6 mt-2">
                            <label className="flex items-center text-sm text-gray-700 cursor-not-allowed">
                                <input
                                    type="radio"
                                    name="nivoRada"
                                    value="osnovni"
                                    checked={nivoRada === 'osnovni'}
                                    onChange={() => setNivoRada('osnovni')}
                                    disabled
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <span className="ml-2">Osnovni račun</span>
                            </label>
                            <label className="flex items-center text-sm text-gray-700 cursor-not-allowed">
                                <input
                                    type="radio"
                                    name="nivoRada"
                                    value="analitika"
                                    checked={nivoRada === 'analitika'}
                                    onChange={() => setNivoRada('analitika')}
                                    disabled
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <span className="ml-2">Analitika</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
        </>
    );
};

export default ParametriAplikacijePage;
<?php

namespace Database\Seeders;

use App\Models\Airport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AirportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data = [
            ["code"=>"KTM","name"=>"Tribhuvan International Airport","city"=>"Kathmandu","country"=>"Nepal"],
            ["code"=>"DEL","name"=>"Indira Gandhi International Airport","city"=>"Delhi","country"=>"India"],
            ["code"=>"BOM","name"=>"Chhatrapati Shivaji Maharaj International Airport","city"=>"Mumbai","country"=>"India"],
            ["code"=>"DXB","name"=>"Dubai International Airport","city"=>"Dubai","country"=>"UAE"],
            ["code"=>"DOH","name"=>"Hamad International Airport","city"=>"Doha","country"=>"Qatar"],
            ["code"=>"SIN","name"=>"Singapore Changi Airport","city"=>"Singapore","country"=>"Singapore"],
            ["code"=>"BKK","name"=>"Suvarnabhumi Airport","city"=>"Bangkok","country"=>"Thailand"],
            ["code"=>"HKG","name"=>"Hong Kong International Airport","city"=>"Hong Kong","country"=>"China"],
            ["code"=>"KUL","name"=>"Kuala Lumpur International Airport","city"=>"Kuala Lumpur","country"=>"Malaysia"],
            ["code"=>"IST","name"=>"Istanbul Airport","city"=>"Istanbul","country"=>"Türkiye"],
            ["code"=>"LHR","name"=>"London Heathrow Airport","city"=>"London","country"=>"United Kingdom"],
            ["code"=>"FRA","name"=>"Frankfurt Airport","city"=>"Frankfurt","country"=>"Germany"],
            ["code"=>"SYD","name"=>"Sydney Kingsford Smith Airport","city"=>"Sydney","country"=>"Australia"],
            ["code"=>"JFK","name"=>"John F. Kennedy International Airport","city"=>"New York","country"=>"USA"],
            ["code"=>"LAX","name"=>"Los Angeles International Airport","city"=>"Los Angeles","country"=>"USA"]
        ];

        // Optimized insert (One query instead of loop)
        Airport::insert($data);
    }
}

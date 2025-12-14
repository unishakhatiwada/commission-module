<?php

namespace Tests\Feature;

use App\Models\Airport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CommissionTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $ktm;
    private $dxb;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->ktm = Airport::create(['code' => 'KTM', 'name' => 'Kathmandu', 'city' => 'KTM', 'country' => 'NP']);
        $this->dxb = Airport::create(['code' => 'DXB', 'name' => 'Dubai', 'city' => 'DXB', 'country' => 'UAE']);
    }

    #[Test] // <--- 2. Use this attribute
    public function unauthenticated_users_cannot_access_rules()
    {
        $response = $this->getJson('/api/rules');
        $response->assertStatus(401);
    }

    #[Test]
    public function admin_can_create_a_valid_commission_rule()
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'rules' => [
                [
                    'rate' => 10,
                    'rate_type' => 'percentage',
                    'all_origins' => false,
                    'all_destinations' => false,
                    'origins' => [['code' => 'KTM']],
                    'destinations' => [['code' => 'DXB']]
                ]
            ]
        ];

        $response = $this->postJson('/api/rules', $payload);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Rules saved successfully']);

        $this->assertDatabaseHas('commission_rules', [
            'rate' => 10,
            'rate_type' => 'percentage'
        ]);
    }

    #[Test]
    public function it_validates_that_origin_and_destination_cannot_be_same()
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'rules' => [
                [
                    'rate' => 15,
                    'rate_type' => 'flat',
                    'all_origins' => false,
                    'all_destinations' => false,
                    'origins' => [['code' => 'KTM']],
                    'destinations' => [['code' => 'KTM']]
                ]
            ]
        ];

        $response = $this->postJson('/api/rules', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['rules.0.destinations']);
    }

    #[Test]
    public function it_allows_wildcard_all_airports_selection()
    {
        Sanctum::actingAs($this->user);

        $payload = [
            'rules' => [
                [
                    'rate' => 5,
                    'rate_type' => 'percentage',
                    'all_origins' => true,
                    'all_destinations' => false,
                    'origins' => [],
                    'destinations' => [['code' => 'DXB']]
                ]
            ]
        ];

        $response = $this->postJson('/api/rules', $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('commission_rules', [
            'all_origins' => 1,
            'all_destinations' => 0
        ]);
    }
}

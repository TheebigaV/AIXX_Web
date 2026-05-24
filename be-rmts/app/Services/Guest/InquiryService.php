<?php

namespace App\Services\Guest;


use App\Models\Customer;
use App\Models\Inquiry;
use App\Models\User;
use App\Notifications\ContactFormNotification;
use App\Repositories\Guest\CustomerRepository;
use App\Repositories\Guest\InquiryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;


/**
 *
 */
class InquiryService
{
    /**
     * @var InquiryRepository
     */
    private InquiryRepository $inquiryRepository;
    /**
     * @var CustomerRepository
     */
    private CustomerRepository $customerRepository;

    /**
     * @param InquiryRepository $inquiryRepository
     * @param CustomerRepository $customerRepository
     */
    public function __construct(InquiryRepository $inquiryRepository, CustomerRepository $customerRepository)
    {
        $this->inquiryRepository = $inquiryRepository;
        $this->customerRepository = $customerRepository;
    }

    /**
     * @param array $data
     * @return Inquiry
     */
    public function create(array $data): Inquiry
    {
        $customer = $this->findOrCreateCustomer(
            $data['customer_name'],
            $data['customer_email'],
            $data['customer_phone']
        );
        $data['customer_id'] = $customer->id;
        return $this->inquiryRepository->create($data);
    }


    /**
     * @param array $data
     * @return array
     */
    public function submitContactForm(array $data): array
    {
        try {
            $this->findOrCreateCustomer(
                $data['name'],
                $data['email'],
                $data['mobile'] ?? "1234567890"
            );
            \Illuminate\Support\Facades\Notification::route('mail', 'cs@aixx.com.sg')
                ->notify(new ContactFormNotification($data));
            return [
                'status' => true,
                'message' => 'Your message has been sent!'
            ];
        } catch (\Exception $e) {
            Log::error('Contact Form Error: ' . $e->getMessage());
            return [
                'status' => false,
                'message' => 'Something went wrong while sending your message. Please try again later.'
            ];
        }
    }

    /**
     * @param string $name
     * @param string $email
     * @param string $phone
     * @return Customer
     */
    private function findOrCreateCustomer(string $name, string $email, string $phone): Customer
    {
        $customer = $this->customerRepository->findBy('email', $email);
        if (!$customer) {
            return $this->customerRepository->create([
                'name' => $name,
                'email' => $email,
                'mobile' => $phone,
            ]);
        }
        $this->customerRepository->update($customer->id, [
            'name' => $name,
            'mobile' => $phone,
        ]);

        return $customer;
    }


}

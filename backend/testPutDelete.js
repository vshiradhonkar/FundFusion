import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testToken = 'your_jwt_token_here'; // Replace with actual token
const testStartupId = 1; // Replace with actual startup ID
const testOfferId = 1; // Replace with actual offer ID

const testPutDelete = async () => {
  console.log('🧪 Testing PUT and DELETE operations...\n');

  try {
    // Test 1: Update startup details
    console.log('1️⃣ Testing PUT /api/startups/update/:id');
    const updateResponse = await axios.put(`${BASE_URL}/startups/update/${testStartupId}`, {
      name: 'Updated Startup Name',
      pitch_text: 'Updated pitch description',
      money_requested: 150000,
      equity_offered: 12
    }, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    console.log('✅ Update Response:', updateResponse.data);

    // Test 2: Update startup status (admin only)
    console.log('\n2️⃣ Testing PUT /api/startups/status/:id');
    const statusResponse = await axios.put(`${BASE_URL}/startups/status/${testStartupId}`, {
      status: 'approved'
    }, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    console.log('✅ Status Response:', statusResponse.data);

    // Test 3: Delete offer
    console.log('\n3️⃣ Testing DELETE /api/offers/delete/:id');
    const deleteOfferResponse = await axios.delete(`${BASE_URL}/offers/delete/${testOfferId}`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    console.log('✅ Delete Offer Response:', deleteOfferResponse.data);

    // Test 4: Delete startup (WARNING: This will actually delete data)
    console.log('\n4️⃣ Testing DELETE /api/startups/delete/:id');
    // Uncomment the line below to test startup deletion
    // const deleteStartupResponse = await axios.delete(`${BASE_URL}/startups/delete/${testStartupId}`, {
    //   headers: { Authorization: `Bearer ${testToken}` }
    // });
    // console.log('✅ Delete Startup Response:', deleteStartupResponse.data);
    console.log('⚠️ Startup deletion test skipped (uncomment to test)');

  } catch (error) {
    console.error('❌ Test Error:', error.response?.data || error.message);
  }
};

// Run tests
testPutDelete();